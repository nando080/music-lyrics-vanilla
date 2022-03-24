const searchInputEl = document.querySelector('.l-search__input')
const searchButtonEl = document.querySelector('.l-search__button')
const mainContainerEl = document.querySelector('.l-main')
const paginationContainerEl = document.querySelector('.l-pagination')

searchInputEl.value = 'los hermanos'

const api = 'https://api.lyrics.ovh'

/* https://api.lyrics.ovh/suggest/led%20zeppelin
https://api.lyrics.ovh/v1/artist/title */


const formatInputValue = value => {
    const formatedValue =
        value
        .toLowerCase()
        .replace(/[áàâãä]/gmi, 'a')
        .replace(/[éèêë]/gmi, 'e')
        .replace(/[íìîï]/gmi, 'i')
        .replace(/[óòôõö]/gmi, 'o')
        .replace(/[úùûü]/gmi, 'u')
        .replace(/ç/gmi, 'c')
        .replace(/ñ/gmi, 'n')
        .replace(/["'!@#$£%¢¨¬&*()_\-+=§`´^~<>,.;:{}\[\]ªº?|\\\/]/gm, '')
        .replace('   ', ' ')
        .replace('  ', ' ')
    return formatedValue
}

const clearMainContainer = () => {
    mainContainerEl.innerHTML = ''
    paginationContainerEl.classList.remove('is-active')
}

const showErrorMessage = searchTerme => {
    clearMainContainer()
    const errorContainer = document.createElement('div')
    errorContainer.classList.add('c-error-message')
    errorContainer.innerHTML = `
        <p class="c-error-message__text">
            Nenhuma ocorrência de <span class="c-error-message__search">"${searchTerme}"</span> foi encontrada.
        </p>
    `
    mainContainerEl.appendChild(errorContainer)
}

const getHTMLSongs = songs => {
    const HTMLList = songs.map(song => {
        return `
            <li class="c-music-list__item">
                <p class="c-music-list__info">
                    <span class="c-music-list__music-autor">${song.artist.name}</span> - ${song.title}
                </p>
                <button class="c-music-button u-animated-gradient" data-artist="${song.artist.name}" data-title="${song.title}">ver letra</button>
            </li>
        `
    })
    return HTMLList
}

const insertSongsIntoDOM = songs => {
    clearMainContainer()
    const songsContainer = document.createElement('ul')
    songsContainer.setAttribute('class', 'c-music-list is-active')
    songsContainer.innerHTML = songs.join()
    mainContainerEl.appendChild(songsContainer)
}

const paginationHandle = (prev, next) => {
    const prevButton = paginationContainerEl.querySelector('[data-js="prev"]')
    const nextButton = paginationContainerEl.querySelector('[data-js="next"]')
    prevButton.classList.remove('is-active')
    nextButton.classList.remove('is-active')
    if (prev || next) {
        paginationContainerEl.classList.add('is-active')
        if (prev) {
            prevButton.dataset.prev = prev
            prevButton.classList.add('is-active')
        }
        if (next) {
            nextButton.dataset.next = next
            nextButton.classList.add('is-active')
        }
    }
}

const hideSongListPagination = () => {
    const songsContainerEl = document.querySelector('.c-music-list')
    songsContainerEl.classList.remove('is-active')
    paginationContainerEl.classList.remove('is-active')
}

const fetchSongList = async searchTerme => {
    const songsUrl = `${api}/suggest/${formatInputValue(searchTerme)}`
    const response = await fetch(songsUrl)
    const list = await response.json()
    if (list.data.length < 1) {
        showErrorMessage(searchTerme)
        return
    }
    insertSongsIntoDOM(getHTMLSongs(list.data))
    paginationHandle(list.prev, list.next)
}

const loadMoreSongs = async url => {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    const list = await response.json()
    insertSongsIntoDOM(getHTMLSongs(list.data))
    paginationHandle(list.prev, list.next)
}

const fetchLyric = async (artist, title) => {
    const lyricUrl = `${api}/v1/${artist}/${title}`
    const reponse = await fetch(lyricUrl)
    const data = await reponse.json()
    if (data.error) {
        console.log(data.error);
    }
}

const searchInputHandle = () => {
    const inputValue = searchInputEl.value
    if (inputValue !== '') {
        fetchSongList(inputValue)
    }
}

searchButtonEl.addEventListener('click', searchInputHandle)

document.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        searchInputHandle()
    }
})

paginationContainerEl.addEventListener('click', event => {
    const elementDataset = event.target.dataset
    if (elementDataset.js) {
        if (elementDataset.prev) {
            loadMoreSongs(elementDataset.prev)
            return
        }
        if (elementDataset.next) {
            loadMoreSongs(elementDataset.next)
            return
        }
    }
})

mainContainerEl.addEventListener('click', event => {
    const target = event.target
    if (target.classList.contains('c-music-button')) {
        console.log(target.dataset.title)
        console.log(target.dataset.artist)
        hideSongListPagination()
        fetchLyric(target.dataset.artist, target.dataset.title)
    }
})