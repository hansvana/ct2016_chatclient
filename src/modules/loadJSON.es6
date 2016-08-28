module.exports = (path, method = "POST", data = {}, success, error, always = ()=>{}) => {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    console.log(xhr.responseText);
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
            always();
        }
    };

    xhr.open(method, path, true);
    //
    if (method === "POST") {
        //xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        let queryString = "";

        for (let prop in data) {
            queryString += prop + "=" + data[prop] + "&";
        }

        console.log(queryString);
        //xhr.send(JSON.stringify(data));
        xhr.send(queryString);
    } else {
        xhr.send();
    }
};