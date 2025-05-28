#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <netinet/in.h>
#include <mysql/mysql.h>
#include <sodium.h>


#define PORT 8080

MYSQL *con;

void finish_with_error()
{
    fprintf(stderr, "%s\n", mysql_error(con));
    mysql_close(con);
    exit(1);
}

void getUserDetails(int client_fd)
{
    if (mysql_query(con, "SELECT id, fname, lname, email, phone FROM users"))
    {
        finish_with_error();
    }

    MYSQL_RES *res = mysql_store_result(con);
    MYSQL_ROW row;

    char response[5000];
    strcpy(response, "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\n\r\n[");

    int first = 1;
    while ((row = mysql_fetch_row(res)))
    {
        if (!first)
            strcat(response, ",");
        char row_json[200];
        snprintf(row_json, sizeof(row_json), "{\"id\":\"%s\",\"fname\":\"%s\",\"lname\":\"%s\",\"email\":\"%s\",\"phone\":\"%s\"}", row[0], row[1], row[2], row[3], row[4]);
        strcat(response, row_json);
        first = 0;
    }
    strcat(response, "]");

    write(client_fd, response, strlen(response));
    mysql_free_result(res);
}

void login(int client_fd, char *body)
{
    char *email = NULL;
    char *password = NULL;
    char *token = strtok(body, "&");


    while (token != NULL)
    {
        if (strncmp(token, "email=", 6) == 0)
        {
            email = token + 6;
        }
        else if (strncmp(token, "pwd=", 4) == 0)
        {
            password = token + 4;
        }

        token = strtok(NULL, "&");

    }
 char query[256];
    snprintf(query, sizeof(query), "SELECT pwd FROM users WHERE email = '%s'", email);

    if (mysql_query(con, query)) {
        finish_with_error();
        return;
    }

    MYSQL_RES *result = mysql_store_result(con);
    if (result == NULL) {
        finish_with_error();
        return;
    }

    int num_rows = mysql_num_rows(result);
    if (num_rows == 0) {
        // No user found
        mysql_free_result(result);
        char *response = "HTTP/1.1 401 Unauthorized\r\nContent-Type: text/plain\r\nAccess-Control-Allow-Origin: *\r\n\r\nInvalid email or password\n";
        write(client_fd, response, strlen(response));
        return;
    }

    MYSQL_ROW row = mysql_fetch_row(result);
    const char *hashed_pwd = row[0];

    if (crypto_pwhash_str_verify(hashed_pwd, password, strlen(password)) == 0) {
        char *response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nAccess-Control-Allow-Origin: *\r\n\r\nLogin Successful\n";
        write(client_fd, response, strlen(response));
    } else {
        char *response = "HTTP/1.1 401 Unauthorized\r\nContent-Type: text/plain\r\nAccess-Control-Allow-Origin: *\r\n\r\nInvalid password\n";
        write(client_fd, response, strlen(response));
    }

    mysql_free_result(result);
}



void signin(int client_fd, char *body)
{
    char* fname = NULL;
    char* lname = NULL;
    char* email = NULL;
    char* pwd = NULL;
    char* cpwd= NULL;
    char* phone = NULL;
    char* token = strtok(body,"&");

    while(token != NULL){
        if(strncmp(token,"fname=",6) == 0){
            fname = token + 6;
        }else if(strncmp(token,"lname=",6)== 0){
            lname = token + 6;
        }else if(strncmp(token,"email=",6)== 0){
            email = token + 6;
        }else if(strncmp(token,"pwd=",4)== 0){
            pwd = token + 4;
        }else if(strncmp(token,"cpwd=",5)== 0){
            cpwd = token + 5;
        }
        else if(strncmp(token,"phone=",6)== 0){
            phone = token + 6;
        }

        token = strtok(NULL,"&");
    }

    if (sodium_init() < 0) {
        char *response = "HTTP/1.1 500 Internal Server Error\r\nContent-Type: text/plain\r\n\r\nServer error\n";
        write(client_fd, response, strlen(response));
        return;
    }

    char hashed_pwd[crypto_pwhash_STRBYTES];
    if (crypto_pwhash_str(
            hashed_pwd, pwd, strlen(pwd),
            crypto_pwhash_OPSLIMIT_INTERACTIVE,
            crypto_pwhash_MEMLIMIT_INTERACTIVE) != 0) {
        char *response = "HTTP/1.1 500 Internal Server Error\r\nContent-Type: text/plain\r\n\r\nPassword hashing failed\n";
        write(client_fd, response, strlen(response));
        return;
    }

   
    char query[256];
    snprintf(query, sizeof(query), "INSERT INTO users(fname, lname, email, pwd, phone) VALUES('%s', '%s', '%s', '%s', '%s')", fname, lname, email, hashed_pwd, phone);

    if (mysql_query(con, query))
    {
        finish_with_error();
    }

    char *response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nAccess-Control-Allow-Origin: *\r\n\r\nUser added successfully\n";
    write(client_fd, response, strlen(response));
}

void connect_db()
{
    con = mysql_init(NULL);
    if (con == NULL)
    {
        fprintf(stderr, "mysql_init() failed\n");
        exit(1);
    }
    if (mysql_real_connect(con, "localhost", "root", "Keeththi1#", "CUserHub", 0, NULL, 0) == NULL)
    {
        finish_with_error();
    }
}

void handleClient(int client_fd)
{
    char buffer[3000];
    int bufferSize = read(client_fd, buffer, sizeof(buffer) - 1);
    buffer[bufferSize] = '\0';
    printf("%s\n", buffer);

    if (strncmp(buffer, "GET /users", 10) == 0)
    {
        getUserDetails(client_fd);
    }
    else if (strncmp(buffer, "POST /signin", 12) == 0)
    {

        char *body = strstr(buffer, "\r\n\r\n") + 4;
        printf("%s\n", body);
        signin(client_fd, body);
    }
    else if (strncmp(buffer, "POST /login", 11) == 0)
    {

        char *body = strstr(buffer, "\r\n\r\n") + 4;
        printf("%s\n", body);
        login(client_fd, body);
    }

    else
    {
        char *not_found = "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\n\r\nEndpoint not found\n";
        write(client_fd, not_found, strlen(not_found));
    }

    close(client_fd);
}

int main()
{
    connect_db();

    int server_fd, client_fd;
    struct sockaddr_in address;
    int addrlen = sizeof(address);

    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd == 0)
    {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }

    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);

    bind(server_fd, (struct sockaddr *)&address, sizeof(address));
    listen(server_fd, 3);

    printf("Server listening on port %d...\n", PORT);

    while (1)
    {
        client_fd = accept(server_fd, (struct sockaddr *)&address, (socklen_t *)&addrlen);
        if (client_fd < 0)
        {
            perror("accept failed");
            continue;
        }
        handleClient(client_fd);
    }

    mysql_close(con);
    return 0;
}
