# 🚀 GeekBay - Backend API

API REST desenvolvida com **Spring Boot 3**, **PostgreSQL** e
**Flyway**.

------------------------------------------------------------------------

## 🛠️ Tecnologias Utilizadas

-   Java 21\
-   Spring Boot 3.5.11\
-   Spring Web\
-   Spring Data JPA\
-   Hibernate\
-   PostgreSQL\
-   Flyway (migrations)\
-   Spring Validation\
-   Lombok\
-   SpringDoc OpenAPI (Swagger)

------------------------------------------------------------------------

## 📥 Como baixar o projeto

``` bash
git clone https://github.com/ryanpabloac/geekbay.git
cd geekbay
```

------------------------------------------------------------------------

## 🗄️ Configuração do Banco de Dados

Crie o banco de dados:

``` sql
CREATE DATABASE geekbay_db;
```

------------------------------------------------------------------------

## 🔐 Variáveis de Ambiente

``` properties
spring.datasource.url=${DATABASE_URL:jdbc:postgresql://localhost:5432/geekbay_db}
spring.datasource.username=${DATABASE_USERNAME:postgres}
spring.datasource.password=${DATABASE_PASSWORD:root}
```

### 📌 Explicação

A aplicação utiliza variáveis de ambiente para configuração segura.

Se as variáveis não existirem, os valores padrão definidos após `:`
serão utilizados.

------------------------------------------------------------------------

## 🧱 Flyway - Versionamento do Banco

As migrations ficam em:

    src/main/resources/db/migration

Exemplo:

    V1__create_table_usuario.sql
    V2__create_table_categoria.sql

Cada migration: - Possui versão (V1, V2...) - Executa automaticamente ao
iniciar a aplicação - Não deve ser alterada após aplicada

Configuração:

``` properties
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
```

------------------------------------------------------------------------

## 🚫 Por que ddl-auto=none?

``` properties
spring.jpa.hibernate.ddl-auto=none
```

O Hibernate não cria nem altera tabelas automaticamente.\
O controle do schema é feito exclusivamente pelo Flyway.

------------------------------------------------------------------------

## ▶️ Como rodar o projeto

``` bash
mvn clean install
mvn spring-boot:run
```

Acesse:

    http://localhost:8080/swagger-ui.html

------------------------------------------------------------------------

## 📁 Estrutura do Projeto

    src
     ├── controller
     ├── service
     ├── repository
     ├── entities
     ├── dtos
     ├── enums
     └── resources/db/migration

------------------------------------------------------------------------

## Config application.properties

spring.application.name=demo

# Configuracoes do Banco de Dados
spring.datasource.url=jdbc:postgresql://localhost:5432/${nomeBD}
spring.datasource.username=${usuarioBD}
spring.datasource.password=${senhaUsuarioBD}


# Configuracoes do Hibernate/JPA
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect


# Configuracoes do Flyway
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration


# AWS S3
aws.s3.region=${s3.bucket.region}
aws.s3.bucket.name=${s3.bucket.name}
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
AWS_CONFIG_FILE=${AWS_CONFIG_FILE}
AWS_SHARED_CREDENTIALS_FILE=${AWS_SHARED_CREDENTIALS_FILE}

# JWT Secret Key
token.secret.key=${JWT_SECRET:my-secret-key}


------------------------------------------------------------------------