import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

import BillsUI from '../views/BillsUI.js';
import { localStorageMock } from '../__mocks__/localStorage';
import store from "../__mocks__/store"
import { ROUTES } from '../constants/routes';
import Router from "../app/Router";

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
            const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));

            const justif = screen.getByTestId('file');
            justif.addEventListener('change', handleChangeFile);
            fireEvent.change(justif, {
                target: {
                    files: [new File(["justif.png"], "justif.png", { type: "doc/png" })]
                }
            })

            expect(handleChangeFile).toHaveBeenCalled();
            expect(justif.files[0].name).toBe("justif.png");

            /*const errorMessage = screen.getElementsByClassName('error-file-type');
            expect(errorMessage.textContent).toEqual(
                expect.stringContaining(
                    'Seuls les fichiers .jpg, .jpeg et .png sont acceptés.'
                )
            );*/

            //pas nécessaire
            // expect(screen.getAllByText('Seuls les fichiers .jpg, .jpeg et .png sont acceptés.')).not.toBeVisible();

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
            const handleSubmit = jest.fn((e) => newBillContainer.handleSubmit(e));
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

            const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
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

        /*
        const errorMessage = screen.getElementsByClassName('error-file-type');
        expect(errorMessage.textContent).toEqual(
            expect.stringMatching(
                'Seuls les fichiers .jpg, .jpeg et .png sont acceptés.'
            )
        );*/

        expect(screen.getByText("Seuls les fichiers .jpg, .jpeg et .png sont acceptés.")).toBeVisible();
    })


    // récupérés de Dashboard, 
    // même si j'ai comme un doute quand à l'efficacité réelle de ce test :D
    test("fetches messages from an API and fails with 404 message error", async() => {
        const html = BillsUI({ error: "Erreur 404" })
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async() => {
        const html = BillsUI({ error: "Erreur 500" })
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
    })
})

// faire test - mock POST
// je crée une méthode POST en plus de GET dans le dossier __mocks__
describe('Given I am connected as an employee', () => {
    describe("when i create a new bill", () => {

        // test du POST = quand tout va bien
        test('then i post this new bill from mock API post', async() => {
            // je récupère la bill proposée dans le DashboardFormUI
            const bill = {
                "id": "47qAXb6fIm2zOKkLzMro",
                "vat": "80",
                "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
                "status": "accepted",
                "type": "Hôtel et logement",
                "commentAdmin": "ok",
                "commentary": "séminaire billed",
                "name": "encore",
                "fileName": "preview-facture-free-201801-pdf-1.jpg",
                "date": "2004-04-04",
                "amount": 400,
                "email": "a@a",
                "pct": 20
            }
            const postSpy = jest.spyOn(store, 'post');
            const testToPost = await store.post(bill);
            expect(postSpy).toHaveBeenCalledTimes(1)

            //expect(testToPost.data.length).toBe(1)
        })

        // si y'a une erreur 404 ou 500
        test('then bill is posted and there is an error', async() => {
            const html = BillsUI({ error: "Erreur 500" })
            document.body.innerHTML = html;

            store.post.mockImplementationOnce(() => Promise.reject(new Error("Erreur 500")))

            const message = await screen.getByText(/Erreur 500/);
            expect(message).toBeTruthy()
        });

        test('then bill is posted and there is an error', async() => {
            const html = BillsUI({ error: "Erreur 404" })
            document.body.innerHTML = html;

            store.post.mockImplementationOnce(() => Promise.reject(new Error("Erreur 404")))

            const message = await screen.getByText(/Erreur 404/);
            expect(message).toBeTruthy()
        });

    })
})