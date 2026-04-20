package com.sathish.spotify.dto;


import com.sathish.spotify.Document.Album;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class AlbumListResponse {
    private boolean sucess;
    private List<Album> albums;
}
