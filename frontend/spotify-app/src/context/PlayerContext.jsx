import {createContext, useEffect, useState, useContext} from 'react';
import { useAuth, API_BASE_URL } from './AuthContext';
import axios from 'axios';
import { useRef } from 'react';

export const PlayerContext=createContext();

export const PlayerContextProvider=({children})=>{

    const{user,token}=useAuth();
    const [songsData,setSongsData]=useState([]);
    const [albumData,setAlbumData]=useState([]);
    const [track,setTrack]=useState(null);
    const [playStatus,setPlayStatus]=useState(false);
    const [time,setTime]=useState({
        currentTime:{
            second:0,
            minute:0
        },
        totalTime:{
            second:0,
            minute:0
        }
    })
    const audioRef=useRef();
    const seekbg=useRef();
    const seekBar=useRef();
    const shouldAutoPlayRef=useRef(false);

    const play=async()=>{
        if(!audioRef.current) return;
        try{
            await audioRef.current.play();
            setPlayStatus(true); 
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    }

    const pause=()=>{
        shouldAutoPlayRef.current = false;
        if(!audioRef.current) return;
        audioRef.current.pause();
        setPlayStatus(false);
    }

    const togglePlay=()=>{
        if(!audioRef.current) return;

        if(audioRef.current.paused){
            play();
        }else{
            pause();
        }
    }

    const playWithId=async(id)=>{
        const selectedTrack=songsData.find((item)=>id===item._id);
        if(!selectedTrack) return;

        if(track?._id===selectedTrack._id){
            if(audioRef.current){
                audioRef.current.currentTime = 0;
            }
            await play();
            return;
        }

        shouldAutoPlayRef.current = true;
        setTrack(selectedTrack);
    }

    const previous=async()=>{
        if(!track) return;
        const currentIndex=songsData.findIndex((item)=>track._id===item._id);
        if(currentIndex>0){
            shouldAutoPlayRef.current = true;
            setTrack(songsData[currentIndex-1]);
        }
    }

    const next=async()=>{
        if(!track) return;
        const currentIndex=songsData.findIndex((item)=>track._id===item._id);
        if(currentIndex!==-1 && currentIndex<songsData.length-1){
            shouldAutoPlayRef.current = true;
            setTrack(songsData[currentIndex+1]);
        }
    }

    const seekSong=async(e)=>{
        if(!audioRef.current || !seekbg.current) return;
        audioRef.current.currentTime=(e.nativeEvent.offsetX/seekbg.current.offsetWidth)*audioRef.current.duration
    }

    


    const getAuthHeaders = () => {
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const getSongsData=async()=>{
        try{
            const response=await axios.get(`${API_BASE_URL}/api/songs`,{
                headers:getAuthHeaders()
            });
            
            const data=await response.data;
            const songs = data.songs || [];
            
            setSongsData(songs);
            if(songs.length >0){
                setTrack(songs[0]);
            }
            
        } catch (error) {
            console.error("Error fetching songs data:", error);
        }
    };

    const getAlbumData=async()=>{
        try {
            const response=await axios.get(`${API_BASE_URL}/api/albums`,{
                headers:getAuthHeaders()
            });
            const data=await response.data;
            setAlbumData(data.albums || []);
        } catch (error) {
            console.error("Error fetching album data:", error);
        }

    }

    useEffect(()=>{
        if(user && token){
            getSongsData(); 
            getAlbumData();
            
        }
        
    },[user,token]);

    useEffect(()=>{
        const audio=audioRef.current;
        if(!audio) return;

        const updateSeekBar=()=>{
            if(seekBar.current && audio.duration){
                const progress=(audio.currentTime / audio.duration) * 100;
                seekBar.current.style.width=Math.floor(progress) + "%";
                setTime({
                    currentTime:{
                        second:Math.floor(audio.currentTime%60),
                        minute:Math.floor(audio.currentTime/60)
                    },
                     totalTime:{
                        second:Math.floor(audio.duration%60),
                        minute:Math.floor(audio.duration/60)
                    }
                })
            }
        }

        const handleLoadedMetaData=()=>{
            if(seekBar.current){
                seekBar.current.style.width="0%";
            }

            setTime({
                currentTime:{
                    second:0,
                    minute:0
                },
                totalTime:{
                    second:Math.floor((audio.duration || 0)%60),
                    minute:Math.floor((audio.duration || 0)/60)
                }
            });
        }

        const handleEnded=()=>{
            setPlayStatus(false);
            if(seekBar.current){
                seekBar.current.style.width="0%";
            }
        }

        const handlePlay=()=>{
            setPlayStatus(true);
        }

        const handlePause=()=>{
            setPlayStatus(false);
        }

        audio.addEventListener('timeupdate',updateSeekBar);
        audio.addEventListener('loadedmetadata',handleLoadedMetaData);
        audio.addEventListener('ended',handleEnded);
        audio.addEventListener('play',handlePlay);
        audio.addEventListener('pause',handlePause);

        return ()=>{
            audio.removeEventListener('timeupdate',updateSeekBar);
            audio.removeEventListener('loadedmetadata',handleLoadedMetaData);
            audio.removeEventListener('ended',handleEnded);
            audio.removeEventListener('play',handlePlay);
            audio.removeEventListener('pause',handlePause);
        }
        
    },[track]);

    useEffect(()=>{
        const audio=audioRef.current;
        if(!audio || !track) return;

        audio.load();

        if(shouldAutoPlayRef.current){
            shouldAutoPlayRef.current = false;
            audio.play().catch((error)=>{
                console.error("Error playing audio:", error);
                setPlayStatus(false);
            });
        }
    },[track]);

    const contextValue={
        songsData,
        albumData,
        getSongsData,
        getAlbumData,
        audioRef,seekBar,seekbg,track,setTrack,
        playStatus,setPlayStatus,play,pause,togglePlay,playWithId,time,setTime,
        previous,seekSong,next
    };

    return(        
        <PlayerContext.Provider  value={contextValue}>
            <audio ref={audioRef} src={track ? track.file : null} preload="auto" />
            {children}
        </PlayerContext.Provider>
    )
}
