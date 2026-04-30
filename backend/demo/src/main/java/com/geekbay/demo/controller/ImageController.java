package com.geekbay.demo.controller;

import com.geekbay.demo.services.image.ImageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequestMapping("/image")
@RestController
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService){this.imageService = imageService;}

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> uploadImage(@RequestPart MultipartFile image){
        try{
            return ResponseEntity.ok().body(this.imageService.uploadImage(image));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erro imagem ");
        } catch (RuntimeException e){
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().body("Arquivo não suportado");
        }
    }

}
