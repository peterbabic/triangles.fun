/// <reference types="cypress" />

describe("game should", () => {
  it("be able to restart itself", () => {
    cy.visit("/")
    cy.get(".div0.gray").should("be.visible")
    cy.get(".div1.red").should("be.visible")
    cy.get(".div2.red").should("be.visible").click()
    cy.get(".div0.blue").should("be.visible").click()
    cy.get(".div0.red").should("be.visible")
    cy.get(".div1.gray").should("be.visible")
    cy.get(".div2.gray").should("be.visible")
    cy.get(".restart").click()
    cy.get(".div2.red").should("be.visible")
  })
})
