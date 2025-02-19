import axios from "axios";
import { Buffer } from 'buffer';


export const linkToBase64 = async (link: string): Promise<string> => {
    try {
        if(link == null || link == ""){
            return ""
        }

        console.log('chargement image :', link);
        
        const response = await axios.get(link, { responseType: 'arraybuffer' });
        
        if (response == null) {
            return ""
        }
        console.log('Image chargé');
        const base64Image: string = `data:image/jpeg;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
        return base64Image;
                
    } catch (error) {
        console.error('Error fetching and converting image:', error);
        return ""
    }
}
