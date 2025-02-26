import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { linkToBase64 } from '@/helpers/image';

// component représentant la COUVERTURE du livre qui est CLIQUABLE
interface CoverPressableProps {
	id_book: string;
	cover: string; // You can replace 'any' with the appropriate type if known
	mode?: string;
}

const defaultCover = require('@/assets/images/logo_refait.png');


export default function CoverPressable({ id_book, cover , mode = "search" }: CoverPressableProps) {
	// TODO: Faire une diff entre les livre venant de la recherche et les livres de l'étagère
	// car les livres de la recherches ne sont pas dans la BDD

	const [coverUsed, setCoverUsed] = useState("");
	const [imageWidth, setImageWidth] = useState(150)

	useEffect(() => {		
		if(mode = "search"){
			linkToBase64(cover).then((data) => {
				setCoverUsed(data)
				
				Image.getSize(data, (width, height) => {
				  const aspectRatio = width / height; // Calcul du ratio largeur/hauteur
				  setImageWidth(150 * aspectRatio); // Largeur ajustée pour 150px de hauteur
				});
			})
		}else{
			setCoverUsed(cover)
		}
		

	}, [cover]);

	// console.log("idbook cover pressable : ", id_book)
	return (
		<Link push href={{
			pathname: "/book/[idBook]",
			params: {
				idBook: id_book,
				cover: JSON.stringify(cover),
				mode: mode,
			}
		}} asChild>
			<TouchableOpacity>
				<Image source={coverUsed == "" ? defaultCover : {uri: coverUsed}}  style={[styles.coverLivre, {width: imageWidth}]} resizeMode='contain' />
			</TouchableOpacity>
		</Link>
	);
}



const styles = StyleSheet.create({
	coverLivre: {
		maxWidth: 150,
		// width: 100,
		height: 150,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.5)',
	},
});