package com.geekbay.demo.services.image;

import com.geekbay.demo.controller.ImageController;
import com.geekbay.demo.infra.S3Config;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Service
public class ImageService {

    private final S3Config s3Config;

    public ImageService(S3Config s3Config){this.s3Config = s3Config;}


    public String uploadImage(MultipartFile image) throws IOException{

        MagicBytes extensaoImagem = detectType(image);
        if(!extensaoImagem.is(image.getInputStream())){throw new RuntimeException("Arquivo não está no formato de imagem");}

        byte[] file = image.getBytes();

        return this.s3Config.uploadImage(file, UUID.randomUUID().toString());
    }

    public MagicBytes detectType(MultipartFile image) throws IOException{
        for(MagicBytes type: MagicBytes.values()){
            if(type.is(image.getInputStream())) return type;
        }
        return null;
    }

}
