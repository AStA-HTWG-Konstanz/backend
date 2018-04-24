$("#add-category").submit(function (event) {
    event.preventDefault();
    let $form = $(this),
        term = $form.find("input[name='categoryName']").val(),
        url = $form.attr("action");
    let posting = $.post(url, {categoryName: term});
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
