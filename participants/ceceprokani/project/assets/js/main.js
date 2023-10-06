const RENDER_EVENT = 'render-ui'
const STORAGE_KEY = 'bookshelf-apps'

let listBooks = []

// load page
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inputBook')
    const buttonSubmit = document.getElementById('bookSubmit')
    const keyword = document.getElementById('searchBookTitle')
    const searchBook = document.getElementById('searchSubmit')
    const addNewBook = document.getElementById('addNewBook')
    const back = document.getElementById('back')

    const {containerInput, containerSearch, containerBookShelfComplete, conatinerBookShelfInComplete} = getElementContainer()

    const {isComplete} = getElementInputForm()

    // render UI Element
    document.addEventListener(RENDER_EVENT, () => {
        const bookshelfCompletedRead = document.getElementById('completeBookshelfList')
        const bookshelfInCompletedRead = document.getElementById('incompleteBookshelfList')

        bookshelfCompletedRead.innerHTML = ''
        bookshelfInCompletedRead.innerHTML = ''

        let totalBookCompleted = 0
        let totalBookInCompleted = 0

        for (const book of listBooks) {
            const elementBooks = generateElementBooks(book)

            if (book.isComplete) {
                totalBookCompleted++
                bookshelfCompletedRead.append(elementBooks)
            } else {
                totalBookInCompleted++
                bookshelfInCompletedRead.append(elementBooks)
            }
        }

        // set empty state to bookshelf
        if (totalBookCompleted == 0) {
            bookshelfCompletedRead.append(generateElementEmptyState(true))
        } if (totalBookInCompleted == 0) {
            bookshelfInCompletedRead.append(generateElementEmptyState(false))
        }
    })

    // event add new book
    addNewBook.addEventListener('click', (event) => {
        containerInput.style.display = 'flex'
        containerSearch.style.display = 'none'
        containerBookShelfComplete.style.display = 'none'
        conatinerBookShelfInComplete.style.display = 'none'
        
        event.preventDefault()
    })

    // event back to main page
    back.addEventListener('click', (event) => {
        containerInput.style.display = 'none'
        containerSearch.style.display = 'flex'
        containerBookShelfComplete.style.display = 'block'
        conatinerBookShelfInComplete.style.display = 'block'
        
        event.preventDefault()
    })

    // event search book
    searchBook.addEventListener('click', (event) => {
        loadDataFromLocalStorage()
        if (keyword.value) {
            listBooks = findBookByKeyword(keyword.value)
        }

        event.preventDefault()
        document.dispatchEvent(new Event(RENDER_EVENT))
    })

    // event on change status book (complete/incomplete)
    isComplete.addEventListener('change', (event) => {
        const statusIsComplete = event.target.checked

        if (statusIsComplete)
            buttonSubmit.innerHTML = 'Masukan Buku ke rak <span>Selesai dibaca</span>'
        else
            buttonSubmit.innerHTML = 'Masukan Buku ke rak <span>Belum selesai dibaca</span>'
    })

    // event submit form
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        saveData()

        setTimeout(() => {
            containerInput.style.display = 'none'
            containerSearch.style.display = 'flex'
            containerBookShelfComplete.style.display = 'block'
            conatinerBookShelfInComplete.style.display = 'block'
        }, 300);
    })

    // init value local storage
    if (localStorage.getItem(STORAGE_KEY) === null)
        saveDataToLocalStorage()
    // load data from local storage
    loadDataFromLocalStorage()
})

// check if web is support local storage
function checkStorageIsExists() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

// generte id book with timestamp
function generateId() {
    return +new Date()
}

// get element container (input section, search section, bookshelf list)
function getElementContainer() {
    const containerInput = document.getElementById('input_section')
    const containerSearch = document.getElementById('search_section')
    const containerBookShelfComplete = document.getElementById('book_shelf_complete')
    const conatinerBookShelfInComplete = document.getElementById('book_shelf_incomplete')

    return {containerInput, containerSearch, containerBookShelfComplete, conatinerBookShelfInComplete}
}

// get element form input
function getElementInputForm() {
    const title = document.getElementById('inputBookTitle')
    const author = document.getElementById('inputBookAuthor')
    const year = document.getElementById('inputBookYear')
    const isComplete = document.getElementById('inputBookIsComplete')
    const inputBookId = document.getElementById('inputBookId')

    return {title, author, year, isComplete, inputBookId}
}

// generate element empty state
function generateElementEmptyState(isComplete) {
    const container = document.createElement('div')
    const message = document.createElement('p')

    message.innerHTML = '&#9888; Belum ada daftar buku pada rak <span>Belum Selesai Dibaca</span>'
    if (isComplete) {
        message.innerHTML = '&#9888; Belum ada daftar buku pada rak <span>Selesai Dibaca</span>'
    }

    container.classList.add('empty-state')
    container.append(message)

    return container
}

// generate element list book
function generateElementBooks(bookObject) {
    // get all element needed
    const article = document.createElement('article')
    const title = document.createElement('h3')
    const author = document.createElement('p')
    const year = document.createElement('p')
    const actionContainer = document.createElement('div')
    const btnEditStatus = document.createElement('button')
    const btnEdit = document.createElement('button')
    const btnDelete = document.createElement('button')

    btnEdit.innerText = 'Ubah Buku'
    btnDelete.innerText = 'Hapus Buku'
    let isComplete = 1
    if (bookObject.isComplete) {
        btnEditStatus.innerText = 'Belum selesai dibaca'
        isComplete = 0
    } else {
        btnEditStatus.innerText = 'Selesai dibaca'
    }

    btnEditStatus.classList.add('primary')
    btnEdit.classList.add('info')
    btnDelete.classList.add('secondary')
    // action btn edit
    btnEdit.addEventListener('click', () => {
        const {containerInput, containerSearch, containerBookShelfComplete, conatinerBookShelfInComplete} = getElementContainer()

        containerInput.style.display = 'flex'
        containerSearch.style.display = 'none'
        containerBookShelfComplete.style.display = 'none'
        conatinerBookShelfInComplete.style.display = 'none'

        const {title, author, year, isComplete, inputBookId} = getElementInputForm()

        inputBookId.value = bookObject.id
        title.value = bookObject.title
        author.value = bookObject.author
        year.value = bookObject.year
        isComplete.checked = bookObject.isComplete
    })
    // action btn edit status
    btnEditStatus.addEventListener('click', () => {
        updateStatusData(bookObject.id, isComplete)
    })
    // action btn delete
    btnDelete.addEventListener('click', () => {
        deleteData(bookObject.id)
    })

    // append action element
    actionContainer.classList.add('action')
    actionContainer.append(btnEditStatus, btnEdit, btnDelete)

    // set value book object to element
    title.innerText = bookObject.title
    author.innerText = `Penulis : ${bookObject.author}`
    year.innerText = `Tahun : ${bookObject.year}`

    // add all child to parent element
    article.setAttribute('id', `book-${bookObject.id}`)
    article.classList.add('book_item')
    article.append(title, author, year, actionContainer)

    return article
}

// save data book
function saveData() {
    const {title, author, year, isComplete, inputBookId} = getElementInputForm()
    const data = {
        title: title.value,
        author: author.value,
        year: year.value,
        isComplete: isComplete.checked,
    }

    if (inputBookId.value) {
        // find book by id
        const findIndexBook = findBookIndex(inputBookId.value)
        data.id = inputBookId.value
        listBooks.splice(findIndexBook, 1, data)
    } else {
        const generatedId = generateId()
        data.id = generatedId
        listBooks.push(data)
    }

    saveDataToLocalStorage()
    resetForm()
    document.dispatchEvent(new Event(RENDER_EVENT))
}

// reset form input
function resetForm() {
    const {title, author, year, isComplete, inputBookId} = getElementInputForm()

    inputBookId.value = ''
    title.value = ''
    author.value = ''
    year.value = ''
    isComplete.checked = false
}

// load data from local storage
function loadDataFromLocalStorage() {
    try {
        if (checkStorageIsExists) {
            listBooks = []
            const serializedData = localStorage.getItem(STORAGE_KEY)

            if (serializedData == null) return

            let dataParsed = JSON.parse(serializedData)
            for (const book of dataParsed) {
                listBooks.push(book)
            }
            
            document.dispatchEvent(new Event(RENDER_EVENT))
        }
    } catch(error) {
        alert(error.message)
    }
}

// save data to local storage
function saveDataToLocalStorage() {
    if (checkStorageIsExists) {
        const parsedData = JSON.stringify(listBooks)
        localStorage.setItem(STORAGE_KEY, parsedData)
    }
}

// update status book (complete/incomplete)
function updateStatusData(id, status) {
    const findDataBook = findBook(id)
    
    if (findDataBook === null) return

    const confirmation = confirm('Apakah kamu yakin akan mengubah buku menjadi ' + (status ? 'Sudah dibaca' : 'Belum dibaca') + ' ?')

    if (confirmation) {
        findDataBook.isComplete = status
        saveDataToLocalStorage()
        document.dispatchEvent(new Event(RENDER_EVENT))
    }
}

// delete data book
function deleteData(id) {
    const detailBook = findBook(id)
    const confirmation = confirm(`Apakah kamu yakin akan menghapus buku dengan judul ${detailBook.title} ?`)

    if (confirmation) {
        loadDataFromLocalStorage()
        const findIndexBook = findBookIndex(id)

        if (findIndexBook === -1) return

        listBooks.splice(findIndexBook, 1)
        const keyword = document.getElementById('searchBookTitle')
        keyword.value = ''
        saveDataToLocalStorage()
        document.dispatchEvent(new Event(RENDER_EVENT))
    }
}

// find book by keyword
function findBookByKeyword(keyword) {
    let searchBooksResult = []
    for (const book of listBooks) {
        if (book.title.toLowerCase().includes(keyword.toLowerCase())) {
            searchBooksResult.push(book)
        }
    }
    
    return searchBooksResult
}

// find book by id
function findBook(id) {
    for (const book of listBooks) {
        if (id === book.id) {
            return book
        }
    }

    return null
}

// find book index by id
function findBookIndex(id) {
    for (const index in listBooks) {
        if (listBooks[index].id == id) {
            return index
        }
    }

    return -1
}