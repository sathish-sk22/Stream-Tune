package com.sathish.spotify.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.sathish.spotify.Document.Album;
import com.sathish.spotify.dto.AlbumListResponse;
import com.sathish.spotify.dto.AlbumRequest;
import com.sathish.spotify.repository.AlbumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.io.IOException;
import java.util.List;

@Service

@RequiredArgsConstructor
public class AlbumService {
    private final AlbumRepository albumrepo;
    private final AmazonS3 s3;

    public Album addAlbum(AlbumRequest request) throws IOException {

        String fileName = System.currentTimeMillis() + "_" +
                request.getImageFile().getOriginalFilename();

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(request.getImageFile().getSize());
        metadata.setContentType(request.getImageFile().getContentType());

        s3.putObject(
                "sathish-s3-buckets",
                fileName,
                request.getImageFile().getInputStream(),
                metadata
        );

        String imageUrl = s3.getUrl("sathish-s3-buckets", fileName).toString();

        Album newAlbum=Album.builder()
                .name(request.getName())
                .desc(request.getDesc())
                .bgColor(request.getBgColor())
                .imageUrl(imageUrl).build();

        return albumrepo.save(newAlbum);
    }

    public AlbumListResponse getAllAlbums(){
         return new AlbumListResponse(true,albumrepo.findAll());
    }
    public Boolean removeAlbum(String id){
        Album existingAlbum=albumrepo.findById(id).orElseThrow(()->new RuntimeException("Album not found"));
        albumrepo.delete(existingAlbum);
        return true;
    }

}
