// export interface BookInfos{
//     title : string;
//     authors? : string[];
//     imageLinks? : {thumbnail : string};
// }

export interface BookInfos {
	id : string;
	title: string
	description: string;    
	isbn13: string;    
	format: string;    
	publisher: string;    
	publicationDate: string;    
	pageNumber: number;      
	language: string;    
	thumbnail : string;
	authors?: string[];  
	genres?: string[];   
}

export interface BookInfosSearch {
	id : string;
	title: string
	isbn13: string;    
	thumbnail : string;
	authors?: string[];  
}

export interface Book{
    id : string;
    etag : string;
    volumeInfo : BookInfos
}