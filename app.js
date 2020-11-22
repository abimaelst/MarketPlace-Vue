const vm = new Vue ({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
    isActive: true,
    carrinho: [],
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
    },
    removeProduto(index) {
      this.carrinho.splice(index, 1)
    },
    checarLocalStorage() {
      if(window.localStorage.carrinho) {
        this.carrinho = JSON.parse(window.localStorage.carrinho)
      }
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
    }
  },
  created () {
    this.fetchProdutos();
    this.checarLocalStorage()
  },
})