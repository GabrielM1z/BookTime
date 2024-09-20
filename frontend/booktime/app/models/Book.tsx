export interface BookInfos{
    title : string;
    authors? : string[];
    imageLinks? : {thumbnail : string};
}

export interface Book{
    id : string;
    volumeInfo : BookInfos
}