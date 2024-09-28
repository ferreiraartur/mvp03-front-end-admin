# Projeto MVP - Desenvolvimento Front-end Avançado.

Para rodar o software basta seguir os 3 passos abaixo:

### 1: Entrar na pasta
- cd mvp03-front-end-admin

### 2: Instalar as dependências
- npm install

### 3: Executar o serviço
- npm run dev

# Pronto! Agora acesse o sistema utilizando o seu navegador.

## http://localhost:5173/


## Observação: utilizar a porta que está sendo exibido na execução do serviço.

# Utilizando docker
---
## Como executar através do Docker

Certifique-se de ter o [Docker](https://docs.docker.com/engine/install/) instalado e em execução em sua máquina.

Navegue até o diretório que contém o Dockerfile e o requirements.txt no terminal.
Execute **como administrador** o seguinte comando para construir a imagem Docker:

```
$ docker build -t front-end-adm .
```

Uma vez criada a imagem, para executar o container basta executar, **como administrador**, seguinte o comando:

```
$ docker run -p 81:80 front-end-adm
```

Uma vez executando, para acessar o front-end-adm, basta abrir o [http://localhost:81/](http://localhost:81/) no navegador.



### Alguns comandos úteis do Docker

**Para verificar se a imagem foi criada** você pode executar o seguinte comando:

```
$ docker images
```

 Caso queira **remover uma imagem**, basta executar o comando:
```
$ docker rmi <IMAGE ID>
```
Subistituindo o `IMAGE ID` pelo código da imagem

**Para verificar se o container está em exceução** você pode executar o seguinte comando:

```
$ docker container ls --all
```

 Caso queira **parar um conatiner**, basta executar o comando:
```
$ docker stop <CONTAINER ID>
```
Subistituindo o `CONTAINER ID` pelo ID do conatiner


 Caso queira **destruir um conatiner**, basta executar o comando:
```
$ docker rm <CONTAINER ID>

```
**Ajuda**
Caso não tenha permissão para utilizar os comandos docker, pode ser necessário utilizar o sudo na frente de cada comando. Exemplo abaixo:
```
sudo docker "comando"
```

Para mais comandos, veja a [documentação do docker](https://docs.docker.com/engine/reference/run/).

