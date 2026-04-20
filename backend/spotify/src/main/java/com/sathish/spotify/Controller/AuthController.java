package com.sathish.spotify.Controller;

import com.sathish.spotify.Document.User;
import com.sathish.spotify.dto.AuthRequest;
import com.sathish.spotify.dto.AuthResponse;
import com.sathish.spotify.dto.RegisterRequest;
import com.sathish.spotify.dto.UserResponse;
import com.sathish.spotify.service.UserService;
import com.sathish.spotify.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService service;
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request){
       try{
           authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));


          UserDetails userDetails= userDetailsService.loadUserByUsername(request.getEmail());
           String role = userDetails.getAuthorities()
                   .stream()
                   .findFirst()
                   .get()
                   .getAuthority();
          String token=jwtUtil.generateToken(userDetails,role);



           return ResponseEntity.ok(new AuthResponse(token, request.getEmail(), role));


       }catch (Exception e){
           return ResponseEntity.badRequest().body("Email/password is incorrect");
       }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request){
        try{
            UserResponse response=service.registerUser(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @PostMapping("/promote-admin")
    public ResponseEntity<?> promoteToAdmin(@RequestBody Map<String,String> request){
        try{
            User user=service.promoteToAdmin(request.get("email"));
            return ResponseEntity.ok(new AuthResponse(null, user.getEmail(), "ADMIN"));
        }catch(Exception e){
                return ResponseEntity.badRequest().body("Failed to promote user to admin");
        }
    }
}
