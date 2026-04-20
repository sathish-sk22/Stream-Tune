package com.sathish.spotify.repository;

import com.sathish.spotify.Document.Song;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SongRepository extends MongoRepository<Song,String> {
}
