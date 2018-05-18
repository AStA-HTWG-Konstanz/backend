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

$('#add-beverage').submit(function (event) {
   event.preventDefault();
    let $form = $(this),
        beverageName = $form.find("input[name='beverageName']").val(),
        beveragePrice = $form.find("input[name='beveragePrice']").val(),
        url = $form.attr("action");
    let posting = $.post(url, {beverageName: beverageName, beveragePrice: beveragePrice});
    posting.done(function (data) {
        location.reload();
    }).error(function (xhr, ajaxOptions, thrownError) {
        let errorMessage = "";
        if (xhr.status === 400) {
            errorMessage = "Invalid input."
        } else if (xhr.status === 409) {
            errorMessage = "Beverage already exists."
        } else if (xhr.status === 500) {
            errorMessage = "Failed to add beverage. Please try again later."
        }
        $('#beverage-add-error-message').empty().append('<div class="alert alert-danger"><p>' + errorMessage + '</p></div>');
    });
});

function removeBeverage(id) {
    let url = '/endlicht/beverages/delete/';
    let deleteRequest = $.get(url + id);
    deleteRequest.done(function () {
        location.reload();
    }).error(function (xhr, ajaxOptions, thrownError) {
        if (xhr.status === 500) {
            $('#beverage-delete-error-message').empty().append('<div class="alert alert-danger"><p>Failed to delete beverage. Please try again later.</p></div>');
        }
    });
}

$('#set-hours').submit(function (event) {
    event.preventDefault();
    let url = '/endlicht/hours/set?';
    let data = {};
    $('#set-hours input').each(function (idx, itm) {
        if( typeof data[$(itm).data("day")] === "undefined") {
            data[$(itm).data("day")] = {};
        }
       data[$(itm).data("day")][$(itm).attr("name")] = $(itm).val();
    });
    for(let day in data) {
        url += day + "=" + data[day].startTime + "/" + data[day].endTime + '&';
    }
    let setRequest = $.get(url);
    setRequest.done(function () {
        location.reload();
    }).error(function (xhr, ajaxOptions, thrownError) {
        if (xhr.status === 500) {
            $('#hours-set-error-message').empty().append('<div class="alert alert-danger"><p>Failed to set hours. Please try again later.</p></div>');
        } else if (xhr.status === 400) {
            $('#hours-set-error-message').empty().append('<div class="alert alert-danger"><p>Invalid input. Please make sure all fields are correctly filled.</p></div>');
        }
    });
});

function setSpecial(id) {
    let url = '/endlicht/special/set/';
    let setRequest = $.get(url + id);
    setRequest.done(function () {
        location.reload();
    }).error(function (xhr, ajaxOptions, thrownError) {
        if (xhr.status === 500) {
            $('#special-set-error-message').empty().append('<div class="alert alert-danger"><p>Failed to set special. Please try again later.</p></div>');
        }
    });
}
