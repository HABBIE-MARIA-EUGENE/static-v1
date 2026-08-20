const API_URL = "http://127.0.0.1:8000";

const token =
  localStorage.getItem("access_token");


if (!token) {

  window.location.href =
    "login.html";

}



const galleryGrid =
  document.getElementById(
    "admin-gallery-grid"
  );


async function loadGallery() {

  try {

    const response = await fetch(
      `${API_URL}/gallery/`
    );


    if (!response.ok) {

      throw new Error(
        "Failed to load gallery"
      );

    }


    const gallery =
      await response.json();


    displayGallery(gallery);


  } catch (error) {

    console.error(
      "Gallery error:",
      error
    );

    galleryGrid.textContent =
      "Unable to load gallery.";

  }

}





function displayGallery(gallery) {

  galleryGrid.innerHTML = "";


  if (gallery.length === 0) {

    galleryGrid.textContent =
      "No images uploaded yet.";

    return;

  }


  gallery.forEach(item => {

    const card =
      document.createElement("div");

    card.classList.add(
      "admin-gallery-item"
    );


    card.innerHTML = `

      <img
        src="${API_URL}${item.image_url}"
        alt="${item.title}"
      >

      <div class="admin-gallery-info">

        <h3>
          ${item.title}
        </h3>

        <p class="gallery-status">
          Status:
          ${item.is_active
            ? "Active"
            : "Inactive"}
        </p>

      </div>

    `;


    galleryGrid.appendChild(card);

  });

}




const uploadForm =
  document.getElementById(
    "gallery-upload-form"
  );


const uploadMessage =
  document.getElementById(
    "gallery-message"
  );


uploadForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const title =
      document.getElementById(
        "gallery-title"
      ).value;


    const image =
      document.getElementById(
        "gallery-image"
      ).files[0];


    if (!image) {

      uploadMessage.textContent =
        "Please select an image.";

      return;

    }


    const formData =
      new FormData();


    formData.append(
      "title",
      title
    );


    formData.append(
      "image",
      image
    );


    try {

      const response =
        await fetch(
          `${API_URL}/admin/gallery/`,
          {
            method: "POST",

            headers: {
              "Authorization":
                `Bearer ${token}`
            },

            body: formData
          }
        );


      if (response.status === 401) {

        localStorage.removeItem(
          "access_token"
        );

        window.location.href =
          "login.html";

        return;

      }


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          typeof data.detail === "string"
          ? data.detail
          : JSON.stringify(data.detail)
          
        );

      }


      uploadMessage.textContent =
        "Image uploaded successfully!";


      uploadForm.reset();


      await loadGallery();


    } catch (error) {

      console.error(
        "Upload error:",
        error
      );

      uploadMessage.textContent =
        error.message ||
        "Unable to upload image.";

    }

  }
);




document.getElementById(
  "logout-btn"
).addEventListener(
  "click",
  () => {

    localStorage.removeItem(
      "access_token"
    );

    window.location.href =
      "login.html";

  }
);


loadGallery();




