package com.sathish.spotify.repository;

import com.sathish.spotify.Document.Album;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AlbumRepository extends MongoRepository<Album,String> {

}
