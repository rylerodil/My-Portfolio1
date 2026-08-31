

const DB_NAME = "RyleePortfolioDB";
const DB_VERSION = 1;
const STORE_NAME = "files";




const permanentFiles = {

    quiz: [
        {
            name: "Quiz 1",
            file: "quiz1.png",
            type: "image/png"
        }
    ],

    laboratory: [
        {
            name: "Laboratory 1 - RODIL_LAB1.pdf",
            file: "RODIL_LAB1.pdf",
            type: "application/pdf"
        }
    ],

    exam: [

       

    ]

};




function openDatabase() {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(
            DB_NAME,
            DB_VERSION
        );


        request.onupgradeneeded = function () {

            const database = request.result;


            if (
                !database.objectStoreNames.contains(
                    STORE_NAME
                )
            ) {

                database.createObjectStore(
                    STORE_NAME,
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );

            }

        };


        request.onsuccess = function () {

            resolve(request.result);

        };


        request.onerror = function () {

            reject(request.error);

        };

    });

}




async function addFile(file, category) {

    const database =
        await openDatabase();


    return new Promise(
        (resolve, reject) => {

            const transaction =
                database.transaction(
                    STORE_NAME,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    STORE_NAME
                );


            store.add({

                name: file.name,

                type: file.type,

                size: file.size,

                category: category,

                blob: file,

                created: Date.now()

            });


            transaction.oncomplete =
                function () {

                    resolve();

                };


            transaction.onerror =
                function () {

                    reject(
                        transaction.error
                    );

                };

        }
    );

}




async function getFiles(category) {

    const database =
        await openDatabase();


    return new Promise(
        (resolve, reject) => {

            const transaction =
                database.transaction(
                    STORE_NAME,
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    STORE_NAME
                );


            const request =
                store.getAll();


            request.onsuccess =
                function () {

                    const files =
                        request.result
                            .filter(
                                file =>
                                    file.category ===
                                    category
                            )
                            .sort(
                                (a, b) =>
                                    b.created -
                                    a.created
                            );


                    resolve(files);

                };


            request.onerror =
                function () {

                    reject(
                        request.error
                    );

                };

        }
    );

}




async function deleteFile(id) {

    const database =
        await openDatabase();


    return new Promise(
        (resolve, reject) => {

            const transaction =
                database.transaction(
                    STORE_NAME,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    STORE_NAME
                );


            store.delete(id);


            transaction.oncomplete =
                function () {

                    resolve();

                };


            transaction.onerror =
                function () {

                    reject(
                        transaction.error
                    );

                };

        }
    );

}




function formatFileSize(bytes) {

    if (!bytes) {

        return "0 B";

    }


    if (bytes < 1024) {

        return bytes + " B";

    }


    if (bytes < 1048576) {

        return (
            bytes / 1024
        ).toFixed(1) + " KB";

    }


    if (bytes < 1073741824) {

        return (
            bytes / 1048576
        ).toFixed(1) + " MB";

    }


    return (
        bytes / 1073741824
    ).toFixed(1) + " GB";

}




function getFileIcon(type, name) {

    const lowerName =
        name.toLowerCase();


    if (
        type &&
        type.startsWith("image/")
    ) {

        return "fa-image";

    }


    if (
        type === "application/pdf" ||
        lowerName.endsWith(".pdf")
    ) {

        return "fa-file-pdf";

    }


    if (
        type &&
        type.includes("word")
    ) {

        return "fa-file-word";

    }


    if (
        lowerName.endsWith(".doc") ||
        lowerName.endsWith(".docx")
    ) {

        return "fa-file-word";

    }


    if (
        type &&
        type.includes("excel")
    ) {

        return "fa-file-excel";

    }


    if (
        lowerName.endsWith(".xls") ||
        lowerName.endsWith(".xlsx")
    ) {

        return "fa-file-excel";

    }


    if (
        type &&
        type.includes("powerpoint")
    ) {

        return "fa-file-powerpoint";

    }


    if (
        lowerName.endsWith(".ppt") ||
        lowerName.endsWith(".pptx")
    ) {

        return "fa-file-powerpoint";

    }


    if (
        type &&
        type.startsWith("text/")
    ) {

        return "fa-file-lines";

    }


    if (
        lowerName.endsWith(".html") ||
        lowerName.endsWith(".css") ||
        lowerName.endsWith(".js")
    ) {

        return "fa-file-code";

    }


    return "fa-file";

}




function escapeHTML(text) {

    return String(text).replace(
        /[&<>"']/g,
        function (character) {

            const entities = {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            };


            return entities[
                character
            ];

        }
    );

}




function getFileExtension(name) {

    const parts =
        name.split(".");

    if (parts.length < 2) {

        return "FILE";

    }

    return parts
        .pop()
        .toUpperCase();

}




function openPermanentFile(file) {

    const modal =
        document.getElementById(
            "fileModal"
        );


    const title =
        document.getElementById(
            "modalTitle"
        );


    const content =
        document.getElementById(
            "modalContent"
        );


    const closeButton =
        document.getElementById(
            "closeModal"
        );


    if (
        !modal ||
        !title ||
        !content
    ) {

        return;

    }


    title.textContent =
        file.name;


    content.innerHTML = "";


  

    if (
        file.type &&
        file.type.startsWith("image/")
    ) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            file.file;


        image.alt =
            file.name;


        image.style.width =
            "100%";

        image.style.maxHeight =
            "75vh";

        image.style.objectFit =
            "contain";

        image.style.borderRadius =
            "12px";

        image.style.display =
            "block";

        image.style.cursor =
            "zoom-in";




        image.onclick =
            function () {

                image.classList.toggle(
                    "zoomed-image"
                );

            };


        image.onerror =
            function () {

                content.innerHTML = `

                    <div class="unsupported">

                        <div>

                            <i class="
                                fa-solid
                                fa-triangle-exclamation
                            "></i>

                            <h3>
                                Image not found
                            </h3>

                            <p>
                                Make sure that
                                <strong>
                                    ${escapeHTML(file.name)}
                                </strong>
                                is inside your
                                MY-PORTFOLIO folder.
                            </p>

                        </div>

                    </div>

                `;

            };


        content.appendChild(
            image
        );

    }




    else if (
        file.type ===
        "application/pdf" ||
        file.name
            .toLowerCase()
            .endsWith(".pdf")
    ) {

        const iframe =
            document.createElement(
                "iframe"
            );


        iframe.src =
            file.file;


        iframe.title =
            file.name;


        iframe.style.width =
            "100%";

        iframe.style.height =
            "75vh";

        iframe.style.border =
            "none";

        iframe.style.borderRadius =
            "10px";


        content.appendChild(
            iframe
        );

    }




    else {

        content.innerHTML = `

            <div class="unsupported">

                <div>

                    <i class="
                        fa-solid
                        ${getFileIcon(
                            file.type,
                            file.name
                        )}
                    "></i>

                    <h3>
                        File Preview
                    </h3>

                    <p>
                        This file can be opened
                        in a new browser tab.
                    </p>

                    <a
                        href="${file.file}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="view-button"
                        style="
                            display: inline-flex;
                            text-decoration: none;
                            margin-top: 15px;
                        "
                    >

                        <i class="
                            fa-solid
                            fa-up-right-from-square
                        "></i>

                        Open File

                    </a>

                </div>

            </div>

        `;

    }


    modal.classList.add(
        "show"
    );




    function closeViewer() {

        modal.classList.remove(
            "show"
        );

        setTimeout(
            function () {

                content.innerHTML = "";

            },
            250
        );

    }


    if (closeButton) {

        closeButton.onclick =
            closeViewer;

    }


    modal.onclick =
        function (event) {

            if (
                event.target ===
                modal
            ) {

                closeViewer();

            }

        };


}




function openFileViewer(file) {

    const modal =
        document.getElementById(
            "fileModal"
        );


    const title =
        document.getElementById(
            "modalTitle"
        );


    const content =
        document.getElementById(
            "modalContent"
        );


    const closeButton =
        document.getElementById(
            "closeModal"
        );


    if (
        !modal ||
        !title ||
        !content
    ) {

        return;

    }


    title.textContent =
        file.name;


    content.innerHTML = "";


    const fileURL =
        URL.createObjectURL(
            file.blob
        );




    if (
        file.type &&
        file.type.startsWith("image/")
    ) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            fileURL;


        image.alt =
            file.name;


        image.style.width =
            "100%";

        image.style.maxHeight =
            "75vh";

        image.style.objectFit =
            "contain";

        image.style.borderRadius =
            "12px";


        content.appendChild(
            image
        );

    }




    else if (
        file.type ===
        "application/pdf"
    ) {

        const iframe =
            document.createElement(
                "iframe"
            );


        iframe.src =
            fileURL;


        iframe.title =
            file.name;


        iframe.style.width =
            "100%";

        iframe.style.height =
            "75vh";

        iframe.style.border =
            "none";

        iframe.style.borderRadius =
            "10px";


        content.appendChild(
            iframe
        );

    }




    else if (
        file.type &&
        file.type.startsWith("text/")
    ) {

        const reader =
            new FileReader();


        reader.onload =
            function () {

                const pre =
                    document.createElement(
                        "pre"
                    );


                pre.textContent =
                    reader.result;


                content.appendChild(
                    pre
                );

            };


        reader.readAsText(
            file.blob
        );

    }




    else if (

        file.name
            .toLowerCase()
            .endsWith(".html") ||

        file.name
            .toLowerCase()
            .endsWith(".css") ||

        file.name
            .toLowerCase()
            .endsWith(".js")

    ) {

        const reader =
            new FileReader();


        reader.onload =
            function () {

                const pre =
                    document.createElement(
                        "pre"
                    );


                pre.textContent =
                    reader.result;


                content.appendChild(
                    pre
                );

            };


        reader.readAsText(
            file.blob
        );

    }


   

    else {

        content.innerHTML = `

            <div class="unsupported">

                <div>

                    <i class="
                        fa-solid
                        ${getFileIcon(
                            file.type,
                            file.name
                        )}
                    "></i>

                    <h3>
                        Preview is not available
                    </h3>

                    <p>
                        This file type cannot
                        be displayed directly
                        in the browser.
                    </p>

                </div>

            </div>

        `;

    }


    modal.classList.add(
        "show"
    );



    function closeViewer() {

        modal.classList.remove(
            "show"
        );


        setTimeout(
            function () {

                content.innerHTML = "";

            },
            250
        );


        URL.revokeObjectURL(
            fileURL
        );

    }


    if (closeButton) {

        closeButton.onclick =
            closeViewer;

    }


    modal.onclick =
        function (event) {

            if (
                event.target ===
                modal
            ) {

                closeViewer();

            }

        };

}



function createFileCard(
    file,
    index,
    isPermanent
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "file-card reveal-up";


    card.style.animationDelay =
        `${index * 0.07}s`;


    const icon =
        getFileIcon(
            file.type,
            file.name
        );


    const isImage =
        file.type &&
        file.type.startsWith(
            "image/"
        );



    let previewHTML = "";


    if (isImage) {

        const imageSource =
            isPermanent
                ? file.file
                : URL.createObjectURL(
                    file.blob
                );


        previewHTML = `

            <div
                class="file-preview"
                style="
                    overflow: hidden;
                    border-radius: 14px;
                    margin-bottom: 15px;
                    background: rgba(255,255,255,0.04);
                "
            >

                <img
                    src="${imageSource}"
                    alt="${escapeHTML(
                        file.name
                    )}"
                    style="
                        width: 100%;
                        height: 220px;
                        object-fit: contain;
                        display: block;
                        cursor: zoom-in;
                    "
                >

            </div>

        `;

    }




    card.innerHTML = `

        ${previewHTML}


        <div class="file-info">

            <div class="file-icon">

                <i class="
                    fa-solid
                    ${icon}
                "></i>

            </div>


            <div class="file-details">

                <h3
                    title="${escapeHTML(
                        file.name
                    )}"
                >

                    ${escapeHTML(
                        file.name
                    )}

                </h3>


                <p>

                    ${
                        isPermanent
                            ? "Permanent File"
                            : formatFileSize(
                                file.size
                            )
                    }

                    ·

                    ${
                        file.type ||
                        getFileExtension(
                            file.name
                        )
                    }

                </p>

            </div>

        </div>


        <div class="file-actions">

            <button
                class="view-button"
                type="button"
            >

                <i class="
                    fa-solid
                    fa-eye
                "></i>

                View

            </button>


            ${
                isPermanent
                    ? ""
                    : `

                        <button
                            class="delete-button"
                            type="button"
                        >

                            <i class="
                                fa-solid
                                fa-trash
                            "></i>

                            Delete

                        </button>

                    `
            }

        </div>

    `;



    const viewButton =
        card.querySelector(
            ".view-button"
        );


    viewButton.onclick =
        function () {

            if (isPermanent) {

                openPermanentFile(
                    file
                );

            } else {

                openFileViewer(
                    file
                );

            }

        };




    const image =
        card.querySelector(
            ".file-preview img"
        );


    if (image) {

        image.onclick =
            function () {

                if (isPermanent) {

                    openPermanentFile(
                        file
                    );

                } else {

                    openFileViewer(
                        file
                    );

                }

            };




        image.onerror =
            function () {

                this.style.display =
                    "none";

            };

    }




    if (!isPermanent) {

        const deleteButton =
            card.querySelector(
                ".delete-button"
            );


        if (deleteButton) {

            deleteButton.onclick =
                async function () {

                    const confirmed =
                        confirm(
                            `Are you sure you want to delete "${file.name}"?`
                        );


                    if (!confirmed) {

                        return;

                    }


                    try {

                        await deleteFile(
                            file.id
                        );


                        await renderFiles();

                    }


                    catch (error) {

                        console.error(
                            error
                        );


                        alert(
                            "Unable to delete the file."
                        );

                    }

                };

        }

    }


    return card;

}




async function initializeFilePage() {

    const category =
        document.body.dataset.category;


    if (!category) {

        return;

    }


    const input =
        document.getElementById(
            "fileInput"
        );


    const grid =
        document.getElementById(
            "fileGrid"
        );


    const count =
        document.getElementById(
            "fileCount"
        );


    if (
        !input ||
        !grid ||
        !count
    ) {

        return;

    }




    async function renderFiles() {

        grid.innerHTML = "";




        const localFiles =
            await getFiles(
                category
            );


        const permanent =
            permanentFiles[
                category
            ] || [];




        const files = [

            ...permanent.map(
                file => ({

                    ...file,

                    permanent: true

                })
            ),

            ...localFiles

        ];




        count.textContent =

            `${files.length} file${
                files.length === 1
                    ? ""
                    : "s"
            } saved`;



        if (
            files.length === 0
        ) {

            grid.innerHTML = `

                <div class="empty-state">

                    <i class="
                        fa-regular
                        fa-folder-open
                    "></i>


                    <h3>
                        No files yet
                    </h3>


                    <p>
                        No ${escapeHTML(
                            category
                        )} files have been added yet.
                    </p>

                </div>

            `;


            return;

        }




        files.forEach(
            function (
                file,
                index
            ) {

                const card =
                    createFileCard(
                        file,
                        index,
                        file.permanent
                    );


                grid.appendChild(
                    card
                );


   

                setTimeout(
                    function () {

                        card.classList.add(
                            "visible"
                        );

                    },
                    50 + (
                        index * 70
                    )
                );

            }
        );

    }




    input.addEventListener(
        "change",
        async function () {

            const selectedFiles =
                Array.from(
                    input.files
                );


            if (
                selectedFiles.length === 0
            ) {

                return;

            }


            for (
                const file
                of selectedFiles
            ) {



                if (
                    file.size >
                    25 * 1024 * 1024
                ) {

                    alert(
                        `${file.name} is larger than 25 MB and was skipped.`
                    );


                    continue;

                }


                try {

                    await addFile(
                        file,
                        category
                    );

                }


                catch (error) {

                    console.error(
                        "Error saving file:",
                        error
                    );


                    alert(
                        `Unable to save ${file.name}.`
                    );

                }

            }


            input.value = "";


            await renderFiles();

        }
    );




    await renderFiles();

}




function typingEffect() {

    const element =
        document.querySelector(
            ".typing-text"
        );


    if (!element) {

        return;

    }


    const words = [

        "IT Student",

        "Future Developer",

        "Programmer",

        "Technology Enthusiast"

    ];


    let wordIndex = 0;

    let charIndex = 0;

    let deleting = false;


    function type() {

        const currentWord =
            words[wordIndex];


        if (!deleting) {

            element.textContent =
                currentWord.substring(
                    0,
                    charIndex + 1
                );


            charIndex++;


            if (
                charIndex ===
                currentWord.length
            ) {

                deleting = true;


                setTimeout(
                    type,
                    1600
                );


                return;

            }

        }


        else {

            element.textContent =
                currentWord.substring(
                    0,
                    charIndex - 1
                );


            charIndex--;


            if (
                charIndex === 0
            ) {

                deleting = false;


                wordIndex =
                    (
                        wordIndex + 1
                    ) %
                    words.length;

            }

        }


        setTimeout(
            type,
            deleting
                ? 55
                : 90
        );

    }


    type();

}




function initializeScrollReveal() {

    const elements =
        document.querySelectorAll(
            ".reveal-up, .reveal-left, .reveal-right"
        );


    if (
        elements.length === 0
    ) {

        return;

    }


    const observer =
        new IntersectionObserver(
            function (
                entries
            ) {

                entries.forEach(
                    function (
                        entry
                    ) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(
        function (
            element
        ) {

            observer.observe(
                element
            );

        }
    );

}




document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        const modal =
            document.getElementById(
                "fileModal"
            );


        if (
            !modal ||
            !modal.classList.contains(
                "show"
            )
        ) {

            return;

        }


        modal.classList.remove(
            "show"
        );

    }
);



document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeFilePage();

        typingEffect();

        initializeScrollReveal();

    }
);
