import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
    constructor({ document, onNavigate, store, localStorage }) {
        this.document = document
        this.onNavigate = onNavigate
        this.store = store
        const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
        formNewBill.addEventListener("submit", this.handleSubmit)
        const file = this.document.querySelector(`input[data-testid="file"]`)
        file.addEventListener("change", this.handleChangeFile)
        this.fileUrl = null
        this.fileName = null
        this.billId = null
        new Logout({ document, localStorage, onNavigate })
    }
    handleChangeFile = e => {
        e.preventDefault()
        const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
            //console.log(file)
        const filePath = e.target.value.split(/\\/g)
        const fileName = filePath[filePath.length - 1]
        console.log(fileName)
        const formData = new FormData()
        const email = JSON.parse(localStorage.getItem("user")).email
        formData.append('file', file)
        formData.append('email', email)

        // affiche le nom du fichier uploade, je dois verifier que son extension
        // soit bien un .jpg, .jpeg ou .png
        let extension = (fileName.substring(fileName.lastIndexOf(".") + 1)).toString();
        console.log("l'extension du fichier est " + extension);
        const extensionIsValid = ["jpg", "jpeg", "png"];
        // console.log(extensionIsValid.includes(extension))
        // pour le message d'erreur si l'extension du justificatif n'est pas au bon format
        let errorFileExtension = document.querySelector(".error-file-type");

        if (extensionIsValid.includes(extension)) {
            console.log("ok fichier valable");
            errorFileExtension.classList.replace("visible", "hidden")
            this.store
                .bills()
                .create({
                    data: formData,
                    headers: {
                        noContentType: true
                    }
                })
                .then(({ fileUrl, key }) => {
                    console.log(fileUrl)
                    this.billId = key
                    this.fileUrl = fileUrl
                    this.fileName = fileName
                }).catch(error => console.error(error))
        } else {
            console.log("extension de fichier pas valable")
                // supprime le fichier car il n'est pas au bon format
            document.querySelector(`input[data-testid="file"]`).value = null
            errorFileExtension.classList.replace("hidden", "visible")
            return false
        }
    }

    handleSubmit = e => {
        e.preventDefault()
        console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
        const email = JSON.parse(localStorage.getItem("user")).email
        const bill = {
            email,
            type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
            name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
            amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
            date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
            vat: e.target.querySelector(`input[data-testid="vat"]`).value,
            pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
            commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
            fileUrl: this.fileUrl,
            fileName: this.fileName,
            status: 'pending'
        }
        this.updateBill(bill)
        this.onNavigate(ROUTES_PATH['Bills'])
    }

    // not need to cover this function by tests
    updateBill = (bill) => {
        if (this.store) {
            this.store
                .bills()
                .update({ data: JSON.stringify(bill), selector: this.billId })
                .then(() => {
                    this.onNavigate(ROUTES_PATH['Bills'])
                })
                .catch(error => console.error(error))
        }
    }
}