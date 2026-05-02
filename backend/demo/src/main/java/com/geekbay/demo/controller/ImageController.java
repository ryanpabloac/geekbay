package com.geekbay.demo.controller;

import com.geekbay.demo.services.image.ImageService;
import org.apache.coyote.Response;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Optional;

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

    @GetMapping("/{UUID}")
    public ResponseEntity<byte[]> getImage(@PathVariable String UUID){
        try{
            return ResponseEntity.ok(this.imageService.getImage(UUID));
        } catch (IOException e){
            System.out.println("Erro na busca da imagem");
            return ResponseEntity.badRequest().build();
        }
    }

}
