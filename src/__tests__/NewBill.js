import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import extension from "../containers/NewBill.js"

// j'ajoute les imports présents sur le fichier NewBill
// pour disposer des mêmes éléments
import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"


describe("Given I am connected as an employee", () => {
    skip.describe("When I am on NewBill Page", () => {

        //ajout test fonction ouvrir nouvelle note de frais
        test("Then i click on nouvelle note de frais", () => {
            const html = NewBillUI()
            document.body.innerHTML = html
                //to-do write assertion

            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }

            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
        })
    })

    describe("when i click on icon eye", () => {
        test("then it should open the modal", () => {

        })
    })

    // ajout d'un test qui vérifie si l'extension du justificatif est autorisée
    describe("when i select a justificatif", () => {
        test("then it should be a .jpg or .jpeg or .png file", () => {
            expect(extension).toBeTruthy()
        })
    })
})