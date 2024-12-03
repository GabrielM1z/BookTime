// export interface BookInfos{
//     title : string;
//     authors? : string[];
//     imageLinks? : {thumbnail : string};
// }

export interface BookInfos {
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


export interface Book{
    id : string;
    etag : string;
    volumeInfo : BookInfos
}