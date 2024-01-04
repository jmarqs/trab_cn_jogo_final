function setBackground() {
    //obtem imagem enviada id (linha 120 - index)
    const input = document.getElementById('imageInput');
    const file = input.files[0];

    //verifica se foi selecionada a imagem
    if (file) {
        //cria objeto FileReader para ler conteúdo
        const reader = new FileReader();

        //quando leitura é concluída. obtem url da imagem e define como background
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            document.body.style.backgroundImage = `url(${imageUrl})`;
        };

        reader.readAsDataURL(file);
    } else {
        alert('Selecione uma imagem!');
    }
}
