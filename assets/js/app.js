$("#add-category").submit(function (event) {
    event.preventDefault();
    let $form = $(this),
        categoryName = $form.find("input[name='categoryName']").val(),
        url = $form.attr("action");
    let posting = $.post(url, {categoryName: categoryName});
    posting.done(function (data) {
        location.reload();
    }).error(function (xhr, ajaxOptions, thrownError) {
        let errorMessage = "";
        if (xhr.status === 400) {
            errorMessage = "Category can't be empty."
        } else if (xhr.status === 409) {
            errorMessage = "Category already exists."
        } else if (xhr.status === 500) {
            errorMessage = "Failed to add category. Please try again later."
        }
        $('#category-add-error-message').empty().append('<div class="alert alert-danger"><p>' + errorMessage + '</p></div>');
    });
});

function removeCategory(id) {
    let url = '/category/delete/';
    let deleteRequest = $.get(url + id);
    deleteRequest.done(function () {
        location.reload();
    }).error(function (xhr, ajaxOptions, thrownError) {
        if (xhr.status === 500) {
            $('#category-delete-error-message').empty().append('<div class="alert alert-danger"><p>Failed to delete category. Please try again later.</p></div>');
        }
    });
}

$('#add-news').submit(function (event) {
    event.preventDefault();
    let $form = $(this),
        categorySelect = parseInt($form.find("#category-select option:selected").val(),10),
        title = $form.find("input[name='title']").val(),
        shortDescription = $form.find("input[name='shortDescription']").val(),
        newsText = $form.find("textarea[name='newsText']").val(),
        url = $form.attr("action");
    let posting = $.post(url, {
        categorySelect: categorySelect,
        title: title,
        shortDescription: shortDescription,
        newsText: newsText
    });
    posting.done(function (data) {
        location.reload();
    }).error(function (xhr, ajaxOptions, thrownError) {
        let errorMessage = "";
        if (xhr.status === 400) {
            errorMessage = "All Fields are required."
        } else if (xhr.status === 418) {
            errorMessage = "Category must be chosen."
        } else if (xhr.status === 500) {
            errorMessage = "Failed to publish news. Please try again later."
        }
        $('#news-add-error-message').empty().append('<div class="alert alert-danger"><p>' + errorMessage + '</p></div>');
    });
});

function removeNews(id) {
    let url = '/news/delete/';
    let deleteRequest = $.get(url + id);
    deleteRequest.done(function () {
        location.reload();
    }).error(function (xhr, ajaxOptions, thrownError) {
        if (xhr.status === 500) {
            $('#news-delete-error-message').empty().append('<div class="alert alert-danger"><p>Failed to delete news. Please try again later.</p></div>');
        }
    });
}
