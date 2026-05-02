package com.geekbay.demo.services.image;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

//https://stackoverflow.com/questions/41206540/how-to-get-the-magic-number-from-file-in-java
public enum MagicBytes {

    PNG(0x89, 0x50),
    JPG(0xFF, 0XD8);

    private final int[] magicBytes;

                        // Permite criar um conjunto variável de variáveis
                            // Todas essas variáveis vão pro array
    private MagicBytes(int...bytes){this.magicBytes = bytes;}

    public boolean is(byte[] bytes){
        if(bytes.length != magicBytes.length){throw new RuntimeException("Erro no tamanho dos magic numbers");}
        for(int i = 0; i < bytes.length; i++){
                // Converte cada byte percorrido e verifica se são todos iguais ao bytes de um formato específico
            if(Byte.toUnsignedInt(bytes[i]) != magicBytes[i]){return false;}
        }
        return true;
    }

    public static byte[] extract(InputStream is, int length)throws IOException {
        try(is){
            byte[] buffer = new byte[length];
            int totalLidos = 0;

                // Extrai cada byte
            while(totalLidos < length){
                int bytesLidos = is.read(buffer, totalLidos, length - totalLidos);

                if(bytesLidos == -1){throw new RuntimeException("Término imprevisto da leitura dos bytes");}

                totalLidos += bytesLidos;
            }
            return buffer;
        }
    }

        // Recebe o arquivo da camada externa (input usuário)
    public boolean is(File file) throws IOException{
        return is(new FileInputStream(file));
    }

        // Abstrai o arquivo e delega o processamento de dados
    public boolean is(InputStream is) throws IOException{
        return is(extract(is, magicBytes.length));
    }

}
