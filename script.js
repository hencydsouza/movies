const tableBody = document.getElementById('tabel-body')

let file = []
let original = []
let currentPage = 1

await fetch('./movies.json')
    .then((response) => response.json())
    .then((json) => {
        file = json

        file.forEach(movie => {
            movie.combined = Number(((movie.imdb.rating + (movie.tomatoes.viewer.rating * 10) / 5) / 2).toFixed(1))
        })
        original = file
    });

function display(data, page) {
    if (data.length) {
        tableBody.innerHTML = ''
        page = (page - 1) * 5
        for (let i = page; i < page + 5; i++) {
            tableBody.innerHTML += `
        <tr>
            <th scope="row" class="text-start">${data[i].title}</th>
            <td>${data[i].imdb.rating}</td>
            <td>${data[i].tomatoes.viewer.rating}</td>
            <td>${data[i].combined}</td>
            <td>${data[i].plot}</td>
        </tr>`
        }
    } else {
        tableBody.innerHTML = '<h2 class="my-3">No Results Found</h2>'
    }

    // pagination
    const link1 = document.getElementById('page-link-1')
    const link2 = document.getElementById('page-link-2')
    const link3 = document.getElementById('page-link-3')
    const previous = document.getElementById('page-link-previous')
    const next = document.getElementById('page-link-next')

    if (currentPage == 1) {
        link1.classList.add('active')
        link2.classList.remove('active')
        previous.classList.add('disabled')

        link1.innerHTML = currentPage
        link2.innerHTML = currentPage + 1
        link3.innerHTML = currentPage + 2
    } else if (currentPage == Math.floor(file.length / 5)) {
        link2.classList.remove('active')
        link3.classList.add('active')
        next.classList.add('disabled')

        link1.innerHTML = currentPage - 2
        link2.innerHTML = currentPage - 1
        link3.innerHTML = currentPage

    } else {
        link1.classList.remove('active')
        link3.classList.remove('active')
        link2.classList.add('active')
        previous.classList.remove('disabled')
        next.classList.remove('disabled')

        link1.innerHTML = currentPage - 1
        link2.innerHTML = currentPage
        link3.innerHTML = currentPage + 1
    }
}

function pagination() {
    let pagination = document.getElementsByClassName('page-link-num')
    for (let i = 0; i < pagination.length; i++) {
        pagination[i].addEventListener('click', () => {
            let page = Number(pagination[i].innerHTML)
            currentPage = page
            display(file, currentPage)
        })
    }

    let previous = document.getElementById('page-link-previous')
    let next = document.getElementById('page-link-next')
    previous.addEventListener('click', () => {
        currentPage -= 1
        display(file, currentPage)
    })

    next.addEventListener('click', () => {
        currentPage += 1
        display(file, currentPage)
    })
}

function sort() {
    const sortEle = document.getElementsByClassName('sort-ele')
    for (let i = 0; i < sortEle.length; i++) {
        sortEle[i].addEventListener('click', () => {
            const id = sortEle[i].id
            file = file.sort((a, b) => {
                let propA, propB

                if (id === 'title') {
                    propA = a[id].toLowerCase()
                    propB = b[id].toLowerCase()
                    if (propA < propB) return -1;
                    if (propA > propB) return 1;
                } else if (id === 'imdb.rating') {
                    propA = a.imdb.rating;
                    propB = b.imdb.rating;
                } else if (id === 'tomatoes.viewer.rating') {
                    propA = a.tomatoes.viewer.rating;
                    propB = b.tomatoes.viewer.rating;
                } else {
                    propA = a[id]
                    propB = b[id]
                }

                if (propA < propB) return 1;
                if (propA > propB) return -1;
                return 0;
            });
            display(file, currentPage)
        })
    }
}

const filterEle = document.getElementsByClassName('dropdown-item')
for (let i = 0; i < filterEle.length; i++) {
    filterEle[i].addEventListener('click', () => {
        let rate = Number(filterEle[i].innerHTML.split(' ')[0])
        let type = filterEle[i].id.split('-')[0]
        filter(type, rate)
    })
}

function filter(type, rate) {
    file = original
    file = file.filter(movie => {
        if (type === 'imdb') {
            return movie.imdb.rating >= rate;
        } else if (type === 'tomatoes') {
            return movie.tomatoes.viewer.rating >= rate;
        } else if (type === 'combined') {
            return movie.combined >= rate;
        } else {
            return false;
        }
    });
    currentPage = 1
    display(file, currentPage)
}

display(file, currentPage)
pagination()
sort()