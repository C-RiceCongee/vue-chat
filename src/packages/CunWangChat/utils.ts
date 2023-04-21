import axios from "axios"
export function uploadFile(file: File) {
    return new Promise((resolve, reject) => {
        const fd = new FormData()
        fd.append('file', file)
        axios({
            method: "POST",
            url: "http://localhost:8080/upload",
            data: fd
        }).then(r => {
            resolve(r.data)
        }).catch(e=>{
            reject(e)
        })
    })
}
export function base642File(base64Data: string) {
    var arr = base64Data.split(',');
    let t = arr[0]
    let x = t.match(/:(.*?);/) || []
    var mime = x[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], new Date().toISOString() + '.png', { type: mime });
}