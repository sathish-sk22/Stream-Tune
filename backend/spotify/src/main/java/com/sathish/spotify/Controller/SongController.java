package com.sathish.spotify.Controller;

import com.sathish.spotify.dto.SongListResponse;
import com.sathish.spotify.dto.SongRequest;
import com.sathish.spotify.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("api/songs")
@RequiredArgsConstructor
public class SongController {
    private final SongService songService;

    @PostMapping
    public ResponseEntity<?> addSong(@RequestPart("request") String requestString,
                                     @RequestPart("audio") MultipartFile audioFile,
                                     @RequestPart("image") MultipartFile imageFile) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            SongRequest songRequest = objectMapper.readValue(requestString, SongRequest.class);
            songRequest.setImageFile(imageFile);
            songRequest.setAudioFile(audioFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(songService.addSong(songRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listSongs() {
        try {
            return ResponseEntity.ok(songService.getAllSongs());

        } catch (Exception e) {
            return ResponseEntity.ok(new SongListResponse(false, null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSongs(@PathVariable String id){
        try{
            Boolean removed=songService.removeSong(id);
            if(removed){
                return ResponseEntity.noContent().build();
            }else{
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}