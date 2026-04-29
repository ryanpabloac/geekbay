package com.geekbay.demo.infra;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.*;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.identity.spi.IdentityProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.File;

@Component
public class S3Config {

    private final S3Client client;
    private final String bucketName;
    private final String region;

    public S3Config(
            @Value("${AWS_ACCESS_KEY_ID}") String accessKey,
            @Value("${AWS_SECRET_ACCESS_KEY}") String secretKey,
            @Value("${aws.s3.bucket.name}") String bucketName,
            @Value("${aws.s3.region}") String region
    ){
        this.region = region;
        this.bucketName = bucketName;
        this.client = S3Client.builder()
                .region(Region.of(this.region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)
                ))
                .build();
    }

    public String uploadImage(byte[] image, String imageName){

        PutObjectRequest request = PutObjectRequest.builder()
                .key(imageName)
                .bucket(bucketName)
                .build();

        this.client.putObject(request, RequestBody.fromBytes(image));

        return "http://" + bucketName + ".s3." + this.region + ".amazonaws.com/" +  imageName;
    }


}
