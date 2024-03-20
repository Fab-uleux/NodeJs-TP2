import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListeFilms from './ListeFilms';
import TuileFilm from '../TuileFilm/TuileFilm';


describe('Test Unitaire Liste Film', () => {

    // Objet fictif
    const mockFilm = {
        titre: 'Alien - Le 8ème passager',
        genres: ['Horreur', 'Science-fiction'],
        description: 'Un vaisseau spatial perçoit une transmission non-identifiée comme un signal de détresse...',
        titreVignette: 'alienle8emepassager.jpg',
        realisation: 'Ridley Scott',
        annee: 1979,
        notes: [3, 4, 5, 2, 1],
        commentaires: [
            { commentaire: 'Ccommentaire 1', auteur: 'admin' },
            { commentaire: 'Commentaire 2', auteur: 'admin' },
        ]
    };


    test('Vérifie la tuile d\'un film', () => {

        render(<TuileFilm data={mockFilm} />);
        // expect(screen.getByText(mockFilm.titre)).toBeInTheDocument();

        const elImg = document.querySelector('img');
        expect(elImg).toHaveAttribute('src', `img/${mockFilm.titreVignette}`)

    });



    /**
     * À faire
     */
    test('Vérifie si les clés sont présentes dans la réponse', async () => {





    });
});