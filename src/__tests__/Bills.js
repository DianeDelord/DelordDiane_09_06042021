import { screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";

// j'importe les mêmes imports que dans le fichier containers/Bills
// afin d'avoir les mêmes éléments dont a besoin la page pour se construire
import Bills from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";
import VerticalLayout from "../views/VerticalLayout";

// ainsi que de quoi simuler/mocker le DOM
import Router from "../app/Router";
import { ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store";

// les tests à faire
//

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        // icone highlighted ça veut dire quoi?
        test("Then bill icon in vertical layout should be highlighted", () => {
            const html = BillsUI({ data: [] });
            document.body.innerHTML = html;
            //to-do write expect expression
        });
        test("Then bills should be ordered from earliest to latest", () => {
            const html = Bills({ data: bills })
            document.body.innerHTML = html
            const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
            const antiChrono = (a, b) => ((a < b) ? 1 : -1)
            const datesSorted = [...dates].sort(antiChrono)
            expect(dates).toEqual(datesSorted)
        });
    });

    // complété en utilisant le code de __tests__Dashboard.js
    // c'est également un test d'ouverture de modale à la ligne 179
    describe("when i click on icon eye", () => {
        test("then it should open the modal", () => {
            const html = BillsUI({ data: bills });
            document.body.innerHTML = html;

            const store = null;
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            const mockBills = new Bills({
                document,
                onNavigate,
                store,
                localStorage: window.localStorage,
            });
            $.fn.modal = jest.fn();

            const eye = screen.getAllByTestId("icon-eye");
            const verifClickOnEye = jest.fn(mockBills.handleClickIconEye(eye[0]));
            eye[0].addEventListener("click", verifClickOnEye);
            expect(eye[0]).toBeTruthy()

            userEvent.click(eye[0]);
            expect(verifClickOnEye).toHaveBeenCalled();
            // doublon expect(mockBills.handleClickIconEye).toBeCalled(1);

            /*
                        const modal = screen.getByTestId("modal-show");
                        $.fn.modal = jest.fn();

                        expect(modal).toBeTruthy();
                        expect(screen.getByText("Justificatif")).toBeTruthy();

                        const urlJustif = bills[0].fileUrl;
                        expect(urlJustif).toBeTruthy();
                        */
        })
    })

    describe("when i click on nouvelle note de frais", () => {
        test("then it should open the new bill page", () => {
            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            });
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                })
            );
            const html = BillsUI({ data: [...bills] });
            document.body.innerHTML = html;
            const store = null;
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            const mockBills = new Bills({
                document,
                onNavigate,
                store,
                localStorage: window.localStorage,
            });

            const nouvelleNote = screen.getAllByTestId("btn-new-bill");
            expect(nouvelleNote).toBeTruthy()
            const openNewNote = jest.fn(
                mockBills.handleClickNewBill(nouvelleNote[0])
            );
            nouvelleNote[0].addEventListener("click", openNewNote);
            userEvent.click(nouvelleNote[0]);
            expect(openNewNote).toHaveBeenCalled();
        });
    });

    // Loading page BillsUI
    test('Then, Loading page should be rendered', () => {
        Object.defineProperty(window, "localStorage", {
            value: localStorageMock,
        });
        window.localStorage.setItem(
            "user",
            JSON.stringify({
                type: "Employee",
            })
        );
        document.body.innerHTML = BillsUI({ loading: true });
        expect(screen.getAllByText('Loading...')).toBeTruthy();
    });
});