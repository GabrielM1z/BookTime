export interface BookInfos{
    title : string;
    authors? : string[];
    imageLinks? : {thumbnail : string};
}

export interface Book{
    volumeInfo : BookInfos
}

export interface BookResponse{
    kind : string;
    items : Book[];
    totalItems : number;
}