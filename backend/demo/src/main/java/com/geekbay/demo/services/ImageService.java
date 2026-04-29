package com.geekbay.demo.services;

import com.geekbay.demo.infra.S3Config;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.regex.*;
import java.io.IOException;
import java.util.UUID;

@Service
public class ImageService {

    private final S3Config s3Config;

    public ImageService(S3Config s3Config){this.s3Config = s3Config;}

    /*
    public static boolean isImageFile(String contentType){
        // https://www.geeksforgeeks.org/dsa/how-to-validate-image-file-extension-using-regular-expression/

        String regex = "(\\S+(\\.(?i)(jpe?g|png))$)";
        Pattern p = Pattern.compile(regex);
        if(contentType == null) return false;
        Matcher m = p.matcher(contentType);
        return m.matches();
    }   */

    public String uploadImage(MultipartFile image) throws IOException{

        //if(!isImageFile(image.getContentType())) throw new RuntimeException();

        byte[] file = image.getBytes();

        return this.s3Config.uploadImage(file, UUID.randomUUID().toString());
    }

}
