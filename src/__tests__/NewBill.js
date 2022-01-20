import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import extension from "../containers/NewBill.js"

import BillsUI from '../views/BillsUI.js';
import { localStorageMock } from '../__mocks__/localStorage';
import store from "../__mocks__/store"
import { ROUTES } from '../constants/routes';

// j'ajoute les imports présents sur le fichier NewBill
// pour disposer des mêmes éléments
import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"
import userEvent from "@testing-library/user-event";


describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {

        //ajout test fonction vérifie ouverture nouvelle note de frais
        test("Then a form is visible", () => {

            //initialisation
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }

            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            // remplissage
            const html = NewBillUI()
            document.body.innerHTML = html

            // vérification
            const form = document.querySelector('form');
            expect(form).toBeInTheDocument();
        })
    })


    // ajout d'un test qui vérifie si l'extension du justificatif est autorisée
    describe("when i select a justificatif", () => {
        test("then the file uploaded is changed", () => {

            //initialisation
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }

            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            // remplissage
            const html = NewBillUI()
            document.body.innerHTML = html

            const store = null
            const newBill = new NewBill({
                document,
                onNavigate,
                store,
                localStorage: window.localStorage,
            });
            const handleChangeFile = jest.fn(newBill.handleChangeFile());

            const justif = screen.getByTestId('file');
            justif.addEventListener('change', handleChangeFile);
            fireEvent.change(justif, {
                target: {
                    files: [new File(["justif.png"], "justif.png", { type: "doc/png" })]
                }
            })

            expect(handleChangeFile).toHaveBeenCalled();
            expect(justif.files[0].name).toBe("justif.png");

            const errorMessage = screen.getElementsByClassName('error-file-type');
            expect(errorMessage.textContent).toEqual(
                expect.stringContaining(
                    'Seuls les fichiers .jpg, .jpeg et .png sont acceptés.'
                )
            );
            // expect(errorMessage).toBeVisible()
        });
    })

    describe('when i am on NewBill page and i submit a valid form', () => {
        test('then i am redirected to Bills page', () => {
            //initialisation
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }

            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            // DOM construction
            document.body.innerHTML = NewBillUI();
            const store = null
            const newBillContainer = new NewBill({
                document,
                onNavigate,
                store,
                localStorage: window.localStorage,
            });

            // handleEventSubmit justif
            const handleSubmit = jest.fn(newBillContainer.handleSubmit);
            newBillContainer.fileName = 'image.jpg';

            // handleEventSubmit form
            const newBillForm = screen.getByTestId('form-new-bill');
            newBillForm.addEventListener('submit', handleSubmit);
            fireEvent.submit(newBillForm);

            expect(handleSubmit).toHaveBeenCalled();
            expect(screen.getAllByText('Mes notes de frais')).toBeTruthy();
        });
    });

    describe("When I click on submit button of the form", () => {
        test('It should create a new bill', () => {

            // je me suis inspirée des tests Login pour ceux-là
            //initialisation
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }

            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            // remplissage
            const html = NewBillUI()
            document.body.innerHTML = html

            const store = null
            const newBill = new NewBill({
                document,
                onNavigate,
                store,
                localStorage: window.localStorage,
            });

            const handleSubmit = jest.fn(newBill.handleSubmit)
            const newBillform = screen.getByTestId("form-new-bill")
            newBillform.addEventListener('submit', handleSubmit)
            fireEvent.submit(newBillform)
            expect(handleSubmit).toHaveBeenCalled()
        })
    })

    describe('when i am on NewBill page and i try to submit an invalid extension file', () => {
        test('then i can see an error message', () => {});

        //initialisation
        const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname })
        }

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee'
        }))

        // remplissage
        const html = NewBillUI()
        document.body.innerHTML = html

        const store = null
        const newBillContainer = new NewBill({
            document,
            onNavigate,
            store,
            localStorage: window.localStorage,
        });

        const handleChangeFile = jest.fn(newBillContainer.handleChangeFile);

        const attachedFile = screen.getByTestId('file');
        attachedFile.addEventListener('change', handleChangeFile);
        fireEvent.change(attachedFile, {
            target: {
                files: [
                    new File(['justif.pdf'], 'justif.pdf', {
                        type: 'application/pdf',
                    }),
                ],
            },
        });

        expect(handleChangeFile).toHaveBeenCalled();
        expect(attachedFile.files[0].name).toBe('justif.pdf');

        const errorMessage = screen.getElementsByClassName('error-file-type');
        expect(errorMessage.textContent).toEqual(
            expect.stringMatching(
                'Seuls les fichiers .jpg, .jpeg et .png sont acceptés.'
            )
        );
    })
})