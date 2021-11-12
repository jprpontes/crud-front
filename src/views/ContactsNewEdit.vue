<template>
  <div class="contacts-new-edit container my-4">
    <div class="row">
      <div class="col-12 col-md-6 mx-auto">
        <div class="row">
          <div class="col-auto mb-4">
            <span class="fs-4">{{
              $route.name === "ContactsNew"
                ? "Novo contato"
                : "Alteração de contato"
            }}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-12 mb-3">
            <label for="name" class="form-label">Nome</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': !form.name.valid }"
              id="name"
              v-model="form.name.value"
            />
            <div class="invalid-feedback">
              {{ form.name.message }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 mb-3">
            <label for="email" class="form-label">E-mail</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': !form.email.valid }"
              id="email"
              v-model="form.email.value"
            />
            <div class="invalid-feedback">
              {{ form.email.message }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 mb-3">
            <label for="phone-number" class="form-label">Telefone</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': !form.phoneNumber.valid }"
              id="phone-number"
              v-model="form.phoneNumber.value"
            />
            <div class="invalid-feedback">
              {{ form.phoneNumber.message }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 mb-3">
            <label for="zip-code" class="form-label">CEP</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': !form.zipCode.valid }"
              id="zip-code"
              v-model="form.zipCode.value"
              @blur="zipCodeSearch"
            />
            <div class="invalid-feedback">
              {{ form.zipCode.message }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-8 mb-3">
            <label for="address" class="form-label">Endereço</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': !form.address.valid }"
              id="address"
              v-model="form.address.value"
            />
            <div class="invalid-feedback">
              {{ form.address.message }}
            </div>
          </div>
          <div class="col-12 col-md-4 mb-3">
            <label for="address-number" class="form-label">Número</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': !form.addressNumber.valid }"
              id="address-number"
              v-model="form.addressNumber.value"
            />
            <div class="invalid-feedback">
              {{ form.addressNumber.message }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 mb-3">
            <label for="neighborhood" class="form-label">Bairro</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': !form.neighborhood.valid }"
              id="neighborhood"
              v-model="form.neighborhood.value"
            />
            <div class="invalid-feedback">
              {{ form.neighborhood.message }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6 mb-3">
            <label for="state" class="form-label">Estado</label>
            <select
              id="state"
              class="form-select"
              :class="{ 'is-invalid': !form.state.valid }"
              v-model="form.state.value"
            >
              <option
                v-for="state in states"
                :key="state.abbreviation"
                :value="state.abbreviation"
              >
                {{ state.name }}
              </option>
            </select>
            <div class="invalid-feedback">
              {{ form.state.message }}
            </div>
          </div>
          <div class="col-12 col-md-6 mb-3">
            <label for="city" class="form-label">Cidade</label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': !form.city.valid }"
              id="city"
              v-model="form.city.value"
            />
            <div class="invalid-feedback">
              {{ form.city.message }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 mb-3 mt-3 d-flex">
            <button class="btn btn-lg btn-primary flex-fill" @click="save">
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/services/api.js";
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: "ContactsNewEdit",
  components: {},
  data() {
    return {
      states: [],
      form: {
        name: {
          value: null,
          valid: true,
          message: null,
        },
        email: {
          value: null,
          valid: true,
          message: null,
        },
        phoneNumber: {
          value: null,
          valid: true,
          message: null,
        },
        zipCode: {
          value: null,
          valid: true,
          message: null,
        },
        address: {
          value: null,
          valid: true,
          message: null,
        },
        addressNumber: {
          value: null,
          valid: true,
          message: null,
        },
        neighborhood: {
          value: null,
          valid: true,
          message: null,
        },
        state: {
          value: null,
          valid: true,
          message: null,
        },
        city: {
          value: null,
          valid: true,
          message: null,
        },
      },
    };
  },
  created() {
    if (this.$route.name === "ContactsEdit") {
      Swal.showLoading();
    }
  },
  mounted() {
    this.getStates();

    if (this.$route.name === "ContactsEdit") {
      this.edit().finally(() => Swal.close());
    }
  },
  methods: {
    save() {
      if (!this.validateForm()) {
        return;
      }

      if (this.$route.name === "ContactsNew") {
        this.insert();
      } else {
        this.update();
      }
    },
    async zipCodeSearch() {
      if (!this.form.zipCode.value || this.form.zipCode.value.length < 8) {
        return;
      }

      let response = await axios.get(
        `https://cep.awesomeapi.com.br/json/${this.form.zipCode.value}`
      );
      this.form.address.value = response.data.address;
      this.form.state.value = response.data.state;
      this.form.neighborhood.value = response.data.district;
      this.form.city.value = response.data.city;
    },
    async getStates() {
      let response = await api.get(`contacts/states`);
      this.states = response.data.states;
    },
    async edit() {
      let response = await api.get(`contacts/${this.$route.params.id}/edit`);

      this.form.name.value = response.data.contact.name;
      this.form.email.value = response.data.contact.email;
      this.form.phoneNumber.value = response.data.contact.phone_number;
      this.form.zipCode.value = response.data.contact.zip_code;
      this.form.address.value = response.data.contact.address;
      this.form.addressNumber.value = response.data.contact.address_number;
      this.form.neighborhood.value = response.data.contact.neighborhood;
      this.form.state.value = response.data.contact.state;
      this.form.city.value = response.data.contact.city;
    },
    async insert() {
      await api.post("contacts", this.payloadToSave());
      await Swal.fire({
        title: "Contato salvo com sucesso!",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      });
      this.$router.push("/");
    },
    async update() {
      await api.put(`contacts/${this.$route.params.id}`, this.payloadToSave());
      await Swal.fire({
        title: "Contato salvo com sucesso!",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      });
      this.$router.push("/");
    },
    validateForm() {
      let isValid = true;

      if (!this.form.name.value) {
        isValid = false;
        this.form.name.valid = false;
        this.form.name.message = "Informe um nome.";
      } else {
        this.form.name.valid = true;
        this.form.name.message = null;
      }

      if (!this.form.email.value) {
        isValid = false;
        this.form.email.valid = false;
        this.form.email.message = "Informe um e-mail.";
      } else {
        this.form.email.valid = true;
        this.form.email.message = null;
      }

      if (!this.form.phoneNumber.value) {
        isValid = false;
        this.form.phoneNumber.valid = false;
        this.form.phoneNumber.message = "Informe um telefone.";
      } else {
        this.form.phoneNumber.valid = true;
        this.form.phoneNumber.message = null;
      }

      if (!this.form.zipCode.value) {
        isValid = false;
        this.form.zipCode.valid = false;
        this.form.zipCode.message = "Informe um CEP.";
      } else {
        this.form.zipCode.valid = true;
        this.form.zipCode.message = null;
      }

      if (!this.form.address.value) {
        isValid = false;
        this.form.address.valid = false;
        this.form.address.message = "Informe um endereço.";
      } else {
        this.form.address.valid = true;
        this.form.address.message = null;
      }

      if (!this.form.addressNumber.value) {
        isValid = false;
        this.form.addressNumber.valid = false;
        this.form.addressNumber.message = "Informe um número.";
      } else {
        this.form.addressNumber.valid = true;
        this.form.addressNumber.message = null;
      }

      if (!this.form.neighborhood.value) {
        isValid = false;
        this.form.neighborhood.valid = false;
        this.form.neighborhood.message = "Informe um bairro.";
      } else {
        this.form.neighborhood.valid = true;
        this.form.neighborhood.message = null;
      }

      if (!this.form.state.value) {
        isValid = false;
        this.form.state.valid = false;
        this.form.state.message = "Informe um estado.";
      } else {
        this.form.state.valid = true;
        this.form.state.message = null;
      }

      if (!this.form.city.value) {
        isValid = false;
        this.form.city.valid = false;
        this.form.city.message = "Informe uma cidade.";
      } else {
        this.form.city.valid = true;
        this.form.city.message = null;
      }

      return isValid;
    },
    payloadToSave() {
      return {
        name: this.form.name.value,
        email: this.form.email.value,
        phone_number: this.form.phoneNumber.value,
        zip_code: this.form.zipCode.value,
        address: this.form.address.value,
        address_number: this.form.addressNumber.value,
        neighborhood: this.form.neighborhood.value,
        state: this.form.state.value,
        city: this.form.city.value,
      };
    },
  },
};
</script>
