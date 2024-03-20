import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Filtre from './Filtre';


describe('Composant Filtre', () => {

    test('Vérifie la gestion du click et de l\'affichage du filtre actif', async () => {

        // Mock de la fonction handleFiltre
        const handleFiltre = jest.fn();

        render(<Filtre handleFiltre={handleFiltre} />);

        const filterItem = screen.getByText('Réalisateur alphabétique (A-Z)');
        fireEvent.click(filterItem);

        expect(handleFiltre).toHaveBeenCalled();

        const elFiltreActif = screen.getByTestId('filtreActif');
        await waitFor(() => {
            expect(elFiltreActif.textContent).toBe('Réalisateur alphabétique (A-Z)');
        });
    });
});