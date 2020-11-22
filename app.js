const vm = new Vue ({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
    isActive: true,
    carrinho: [],
    carrinhoAtivo: false,
    mensagemAlerta: "item adicionado",
    alertaAtivo: false
  },
  computed: {
    carrinhoTotal() {
      const total = this.carrinho.reduce((acc, curr) => {
        return acc + curr.preco
      }, 0)
      return total
    }
  },
  methods: {
    fetchProdutos() {
      fetch("./api/produtos.json")
        .then(res => res.json())
        .then(res => {
          this.produtos = res
        })
    },
    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
      .then(res => res.json())
      .then(res => {
        this.produto = res
      })
    },
    contarEstrelas(qtd) {
      return '⭐'.repeat(qtd)
    },
    abrirModal(id) {
      this.fetchProduto(id)
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    adicionarItem() {
      this.produto.estoque--
      const {id, nome, preco} = this.produto
      this.carrinho.push({id, nome, preco})
      this.alerta(`${nome} adicionado ao carrinho.`)
    },
    removeProduto(index) {
      this.carrinho.splice(index, 1)
    },
    checarLocalStorage() {
      if(window.localStorage.carrinho) {
        this.carrinho = JSON.parse(window.localStorage.carrinho)
      }
    },
    alerta(msg) {
      this.mensagemAlerta = msg
      this.alertaAtivo = true
      setTimeout(() => {
        this.alertaAtivo = false
      }, 2000)
    },
    router() {
      const hash = document.location.hash;
       if(hash) this.fetchProduto(hash.replace("#", ""))
    }
  },
  filters: {
    numeroPreco(valor) {
      return valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
    }
  },
  watch: {
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho)
    },
    produto() {
      document.title = this.produto.nome || "Techno"
      const hash = this.produto.id || ''
      history.pushState(null, null, `#${hash}`)
    }
  },
  created () {
    this.fetchProdutos();
    this.checarLocalStorage()
    this.router()
  },
})