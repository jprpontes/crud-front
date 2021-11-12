<template>
  <div class="contacts container my-4">
    <div class="row">
      <div class="col-auto">
        <span class="fs-4">Contatos</span>
      </div>
      <div class="col-auto ms-auto">
        <ul class="nav nav-pills">
          <li class="nav-item">
            <router-link
              :to="{ name: 'ContactsNew' }"
              class="nav-link active"
              aria-current="page"
              >Novo contato</router-link
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="row">
      <div class="col-12 mt-3 table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">E-mail</th>
              <th scope="col">Telefone</th>
              <th scope="col">CEP</th>
              <th scope="col">Endereço</th>
              <th scope="col">Número</th>
              <th scope="col">Bairro</th>
              <th scope="col">UF</th>
              <th scope="col">Cidade</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contact in contacts" :key="contact.id">
              <td>{{ contact.name }}</td>
              <td>{{ contact.email }}</td>
              <td>{{ phoneFormat(contact.phoneNumber) }}</td>
              <td>{{ zipCodeFormat(contact.zipCode) }}</td>
              <td>{{ contact.address }}</td>
              <td>{{ contact.addressNumber }}</td>
              <td>{{ contact.neighborhood }}</td>
              <td>{{ contact.state }}</td>
              <td>{{ contact.city }}</td>
              <td>
                <router-link
                  :to="{ name: 'ContactsEdit', params: { id: contact.id } }"
                  class="btn btn-sm btn-primary"
                  >Editar</router-link
                >
              </td>
              <td>
                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteContact(contact)"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/services/api.js";
import Swal from "sweetalert2";
export default {
  name: "ContactsNew",
  components: {},
  data() {
    return {
      contacts: [],
    };
  },
  created() {
    Swal.showLoading();
  },
  mounted() {
    this.getContacts().finally(() => Swal.close());
  },
  methods: {
    phoneFormat(text) {
      return text.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    },
    zipCodeFormat(text) {
      return text.replace(/(\d{5})(\d{3})/, "$1-$2");
    },
    async getContacts() {
      let response = await api.get("contacts");
      this.contacts = response.data.contacts;
    },
    deleteContact(contact) {
      Swal.fire({
        title: "Tem certeza?",
        text: "Você não poderá reverter isso!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        // cancelButtonColor: "#33d",
        confirmButtonText: "Sim, excluir!",
        dangerMode: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await api.delete(`contacts/${contact.id}`);
          Swal.fire({
            title: "Contato excluído com sucesso!",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          });
          this.getContacts();
        }
      });
    },
  },
};
</script>
