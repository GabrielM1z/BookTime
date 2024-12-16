FROM golang:1.23.3 as prod

WORKDIR /app

# pre-copy/cache go.mod for pre-downloading dependencies and only redownloading them in subsequent builds if they change
COPY go.mod ./
RUN go mod download && go mod verify

COPY . .
RUN go build -v -o main .

CMD ["/app/main"]

# ------------------------------------
    
FROM golang:1.23.3 as debug

WORKDIR /app

# pre-copy/cache go.mod for pre-downloading dependencies and only redownloading them in subsequent builds if they change
COPY go.mod ./
RUN go mod download && go mod verify

COPY . .

RUN go install github.com/go-delve/delve/cmd/dlv@latest

RUN go build -v -o main .

#CMD ["/app/main"]

COPY ./dlv.sh /
RUN chmod +x /dlv.sh
ENTRYPOINT [ "/dlv.sh" ]