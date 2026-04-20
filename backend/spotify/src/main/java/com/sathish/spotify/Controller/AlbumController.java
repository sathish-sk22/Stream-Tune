package com.sathish.spotify.Controller;

import com.sathish.spotify.dto.AlbumListResponse;
import com.sathish.spotify.dto.AlbumRequest;
import com.sathish.spotify.service.AlbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/albums")
@RequiredArgsConstructor
public class AlbumController {
    private final AlbumService albumService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> addAlbum(@RequestPart("request") String request, @RequestPart("file")MultipartFile file){
        try{
            ObjectMapper objectMapper=new ObjectMapper();
            AlbumRequest albumRequest=objectMapper.readValue(request,AlbumRequest.class);
            albumRequest.setImageFile(file);
            return ResponseEntity.status(HttpStatus.CREATED).body(albumService.addAlbum(albumRequest));
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
    @GetMapping
    public ResponseEntity<?> listAlbums(){
        try{
           return ResponseEntity.ok(albumService.getAllAlbums());
        } catch (Exception e) {
            return ResponseEntity.ok(new AlbumListResponse(false,null));
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAlbums(@PathVariable String id){
        try{
            Boolean removed=albumService.removeAlbum(id);
            if(removed){
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }else{
                return ResponseEntity.badRequest().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
