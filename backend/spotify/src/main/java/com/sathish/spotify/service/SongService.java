package com.sathish.spotify.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.mpatric.mp3agic.Mp3File;
import com.sathish.spotify.Document.Album;
import com.sathish.spotify.Document.Song;
import com.sathish.spotify.dto.SongListResponse;
import com.sathish.spotify.dto.SongRequest;
import com.sathish.spotify.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@Service
@RequiredArgsConstructor
public class SongService {
    private final SongRepository songRepository;
    private final AmazonS3 s3;

    public Song addSong(SongRequest request) throws Exception{
        try {

            String fileName = System.currentTimeMillis() + "_" +
                    request.getAudioFile().getOriginalFilename();

            String imageFileName = System.currentTimeMillis() + "_image_" +
                    request.getImageFile().getOriginalFilename();

            String duration = getDuration(request.getAudioFile());


            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(request.getAudioFile().getSize());
            metadata.setContentType(request.getAudioFile().getContentType());

            s3.putObject(
                    "sathish-s3-buckets",
                    fileName,
                    request.getAudioFile().getInputStream(),
                    metadata
            );

            String fileUrl = s3.getUrl("sathish-s3-buckets", fileName).toString();

            ObjectMetadata imageMetadata = new ObjectMetadata();
            imageMetadata.setContentLength(request.getImageFile().getSize());
            imageMetadata.setContentType(request.getImageFile().getContentType());

            s3.putObject(
                    "sathish-s3-buckets",
                    imageFileName,
                    request.getImageFile().getInputStream(),
                    imageMetadata
            );

            String imageUrl = s3.getUrl("sathish-s3-buckets", imageFileName).toString();

            // 🔹 SAVE
            Song newsong = Song.builder()
                    .name(request.getName())
                    .desc(request.getDesc())
                    .album(request.getAlbum())
                    .duration(duration)
                    .file(fileUrl)
                    .image(imageUrl)
                    .build();

            return songRepository.save(newsong);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }

    private String getDuration(MultipartFile file) {
        File convFile = null;

        try {
            convFile = File.createTempFile("temp", ".mp3");


            try (var inputStream = file.getInputStream();
                 var outputStream = new java.io.FileOutputStream(convFile)) {

                inputStream.transferTo(outputStream);
            }

            Mp3File mp3 = new Mp3File(convFile);
            long seconds = mp3.getLengthInSeconds();

            return formatDuration(seconds);

        } catch (Exception e) {
            System.out.println("Duration error: " + e.getMessage());
            return "00:00";

        } finally {
            if (convFile != null && convFile.exists()) {
                convFile.delete();
            }
        }
    }

    private String formatDuration(long seconds) {
        long minutes = seconds / 60;
        long remainingSeconds = seconds % 60;
        return String.format("%02d:%02d", minutes, remainingSeconds);
    }

    public SongListResponse getAllSongs(){
        return new SongListResponse(true,songRepository.findAll());

    }

    public Boolean removeSong(String id){
        Song existingSong=songRepository.findById(id).orElseThrow(()->new RuntimeException("songNot found"));
        songRepository.delete(existingSong);
        return true;
    }

}
