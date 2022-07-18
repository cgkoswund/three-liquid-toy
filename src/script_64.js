import "./style.css";
import * as THREE from "three";

var width = window.innerWidth;
var height = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

let image = new Image();
image.src =
  "data:image/jpeg;base64,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";

image.src =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABa4AAAFzCAYAAADWjJ7pAAAgAElEQVR4Xu3YMREAAAwCseLfdG38kCrgUiZ2jgABAgQIECBAgAABAgQIECBAgAABAgQIhAQWyiIKAQIECBAgQIAAAQIECBAgQIAAAQIECBA4w7USECBAgAABAgQIECBAgAABAgQIECBAgEBKwHCdeocwBAgQIECAAAECBAgQIECAAAECBAgQIGC41gECBAgQIECAAAECBAgQIECAAAECBAgQSAkYrlPvEIYAAQIECBAgQIAAAQIECBAgQIAAAQIEDNc6QIAAAQIECBAgQIAAAQIECBAgQIAAAQIpAcN16h3CECBAgAABAgQIECBAgAABAgQIECBAgIDhWgcIECBAgAABAgQIECBAgAABAgQIECBAICVguE69QxgCBAgQIECAAAECBAgQIECAAAECBAgQMFzrAAECBAgQIECAAAECBAgQIECAAAECBAikBAzXqXcIQ4AAAQIECBAgQIAAAQIECBAgQIAAAQKGax0gQIAAAQIECBAgQIAAAQIECBAgQIAAgZSA4Tr1DmEIECBAgAABAgQIECBAgAABAgQIECBAwHCtAwQIECBAgAABAgQIECBAgAABAgQIECCQEjBcp94hDAECBAgQIECAAAECBAgQIECAAAECBAgYrnWAAAECBAgQIECAAAECBAgQIECAAAECBFIChuvUO4QhQIAAAQIECBAgQIAAAQIECBAgQIAAAcO1DhAgQIAAAQIECBAgQIAAAQIECBAgQIBASsBwnXqHMAQIECBAgAABAgQIECBAgAABAgQIECBguNYBAgQIECBAgAABAgQIECBAgAABAgQIEEgJGK5T7xCGAAECBAgQIECAAAECBAgQIECAAAECBAzXOkCAAAECBAgQIECAAAECBAgQIECAAAECKQHDdeodwhAgQIAAAQIECBAgQIAAAQIECBAgQICA4VoHCBAgQIAAAQIECBAgQIAAAQIECBAgQCAlYLhOvUMYAgQIECBAgAABAgQIECBAgAABAgQIEDBc6wABAgQIECBAgAABAgQIECBAgAABAgQIpAQM16l3CEOAAAECBAgQIECAAAECBAgQIECAAAEChmsdIECAAAECBAgQIECAAAECBAgQIECAAIGUgOE69Q5hCBAgQIAAAQIECBAgQIAAAQIECBAgQMBwrQMECBAgQIAAAQIECBAgQIAAAQIECBAgkBIwXKfeIQwBAgQIECBAgAABAgQIECBAgAABAgQIGK51gAABAgQIECBAgAABAgQIECBAgAABAgRSAobr1DuEIUCAAAECBAgQIECAAAECBAgQIECAAAHDtQ4QIECAAAECBAgQIECAAAECBAgQIECAQErAcJ16hzAECBAgQIAAAQIECBAgQIAAAQIECBAgYLjWAQIECBAgQIAAAQIECBAgQIAAAQIECBBICRiuU+8QhgABAgQIECBAgAABAgQIECBAgAABAgQM1zpAgAABAgQIECBAgAABAgQIECBAgAABAikBw3XqHcIQIECAAAECBAgQIECAAAECBAgQIECAgOFaBwgQIECAAAECBAgQIECAAAECBAgQIEAgJWC4Tr1DGAIECBAgQIAAAQIECBAgQIAAAQIECBAwXOsAAQIECBAgQIAAAQIECBAgQIAAAQIECKQEDNepdwhDgAABAgQIECBAgAABAgQIECBAgAABAoZrHSBAgAABAgQIECBAgAABAgQIECBAgACBlIDhOvUOYQgQIECAAAECBAgQIECAAAECBAgQIEDAcK0DBAgQIECAAAECBAgQIECAAAECBAgQIJASMFyn3iEMAQIECBAgQIAAAQIECBAgQIAAAQIECBiudYAAAQIECBAgQIAAAQIECBAgQIAAAQIEUgKG69Q7hCFAgAABAgQIECBAgAABAgQIECBAgAABw7UOECBAgAABAgQIECBAgAABAgQIECBAgEBKwHCdeocwBAgQIECAAAECBAgQIECAAAECBAgQIGC41gECBAgQIECAAAECBAgQIECAAAECBAgQSAkYrlPvEIYAAQIECBAgQIAAAQIECBAgQIAAAQIEDNc6QIAAAQIECBAgQIAAAQIECBAgQIAAAQIpAcN16h3CECBAgAABAgQIECBAgAABAgQIECBAgIDhWgcIECBAgAABAgQIECBAgAABAgQIECBAICVguE69QxgCBAgQIECAAAECBAgQIECAAAECBAgQMFzrAAECBAgQIECAAAECBAgQIECAAAECBAikBAzXqXcIQ4AAAQIECBAgQIAAAQIECBAgQIAAAQKGax0gQIAAAQIECBAgQIAAAQIECBAgQIAAgZSA4Tr1DmEIECBAgAABAgQIECBAgAABAgQIECBAwHCtAwQIECBAgAABAgQIECBAgAABAgQIECCQEjBcp94hDAECBAgQIECAAAECBAgQIECAAAECBAgYrnWAAAECBAgQIECAAAECBAgQIECAAAECBFIChuvUO4QhQIAAAQIECBAgQIAAAQIECBAgQIAAAcO1DhAgQIAAAQIECBAgQIAAAQIECBAgQIBASsBwnXqHMAQIECBAgAABAgQIECBAgAABAgQIECBguNYBAgQIECBAgAABAgQIECBAgAABAgQIEEgJGK5T7xCGAAECBAgQIECAAAECBAgQIECAAAECBAzXOkCAAAECBAgQIECAAAECBAgQIECAAAECKQHDdeodwhAgQIAAAQIECBAgQIAAAQIECBAgQICA4VoHCBAgQIAAAQIECBAgQIAAAQIECBAgQCAlYLhOvUMYAgQIECBAgAABAgQIECBAgAABAgQIEDBc6wABAgQIECBAgAABAgQIECBAgAABAgQIpAQM16l3CEOAAAECBAgQIECAAAECBAgQIECAAAEChmsdIECAAAECBAgQIECAAAECBAgQIECAAIGUgOE69Q5hCBAgQIAAAQIECBAgQIAAAQIECBAgQMBwrQMECBAgQIAAAQIECBAgQIAAAQIECBAgkBIwXKfeIQwBAgQIECBAgAABAgQIECBAgAABAgQIGK51gAABAgQIECBAgAABAgQIECBAgAABAgRSAobr1DuEIUCAAAECBAgQIECAAAECBAgQIECAAAHDtQ4QIECAAAECBAgQIECAAAECBAgQIECAQErAcJ16hzAECBAgQIAAAQIECBAgQIAAAQIECBAgYLjWAQIECBAgQIAAAQIECBAgQIAAAQIECBBICRiuU+8QhgABAgQIECBAgAABAgQIECBAgAABAgQM1zpAgAABAgQIECBAgAABAgQIECBAgAABAikBw3XqHcIQIECAAAECBAgQIECAAAECBAgQIECAgOFaBwgQIECAAAECBAgQIECAAAECBAgQIEAgJWC4Tr1DGAIECBAgQIAAAQIECBAgQIAAAQIECBAwXOsAAQIECBAgQIAAAQIECBAgQIAAAQIECKQEDNepdwhDgAABAgQIECBAgAABAgQIECBAgAABAoZrHSBAgAABAgQIECBAgAABAgQIECBAgACBlIDhOvUOYQgQIECAAAECBAgQIECAAAECBAgQIEDAcK0DBAgQIECAAAECBAgQIECAAAECBAgQIJASMFyn3iEMAQIECBAgQIAAAQIECBAgQIAAAQIECBiudYAAAQIECBAgQIAAAQIECBAgQIAAAQIEUgKG69Q7hCFAgAABAgQIECBAgAABAgQIECBAgAABw7UOECBAgAABAgQIECBAgAABAgQIECBAgEBKwHCdeocwBAgQIECAAAECBAgQIECAAAECBAgQIGC41gECBAgQIECAAAECBAgQIECAAAECBAgQSAkYrlPvEIYAAQIECBAgQIAAAQIECBAgQIAAAQIEDNc6QIAAAQIECBAgQIAAAQIECBAgQIAAAQIpAcN16h3CECBAgAABAgQIECBAgAABAgQIECBAgIDhWgcIECBAgAABAgQIECBAgAABAgQIECBAICVguE69QxgCBAgQIECAAAECBAgQIECAAAECBAgQMFzrAAECBAgQIECAAAECBAgQIECAAAECBAikBAzXqXcIQ4AAAQIECBAgQIAAAQIECBAgQIAAAQKGax0gQIAAAQIECBAgQIAAAQIECBAgQIAAgZSA4Tr1DmEIECBAgAABAgQIECBAgAABAgQIECBAwHCtAwQIECBAgAABAgQIECBAgAABAgQIECCQEjBcp94hDAECBAgQIECAAAECBAgQIECAAAECBAgYrnWAAAECBAgQIECAAAECBAgQIECAAAECBFIChuvUO4QhQIAAAQIECBAgQIAAAQIECBAgQIAAAcO1DhAgQIAAAQIECBAgQIAAAQIECBAgQIBASsBwnXqHMAQIECBAgAABAgQIECBAgAABAgQIECBguNYBAgQIECBAgAABAgQIECBAgAABAgQIEEgJGK5T7xCGAAECBAgQIECAAAECBAgQIECAAAECBAzXOkCAAAECBAgQIECAAAECBAgQIECAAAECKQHDdeodwhAgQIAAAQIECBAgQIAAAQIECBAgQICA4VoHCBAgQIAAAQIECBAgQIAAAQIECBAgQCAlYLhOvUMYAgQIECBAgAABAgQIECBAgAABAgQIEDBc6wABAgQIECBAgAABAgQIECBAgAABAgQIpAQM16l3CEOAAAECBAgQIECAAAECBAgQIECAAAEChmsdIECAAAECBAgQIECAAAECBAgQIECAAIGUgOE69Q5hCBAgQIAAAQIECBAgQIAAAQIECBAgQMBwrQMECBAgQIAAAQIECBAgQIAAAQIECBAgkBIwXKfeIQwBAgQIECBAgAABAgQIECBAgAABAgQIGK51gAABAgQIECBAgAABAgQIECBAgAABAgRSAobr1DuEIUCAAAECBAgQIECAAAECBAgQIECAAAHDtQ4QIECAAAECBAgQIECAAAECBAgQIECAQErAcJ16hzAECBAgQIAAAQIECBAgQIAAAQIECBAgYLjWAQIECBAgQIAAAQIECBAgQIAAAQIECBBICRiuU+8QhgABAgQIECBAgAABAgQIECBAgAABAgQM1zpAgAABAgQIECBAgAABAgQIECBAgAABAikBw3XqHcIQIECAAAECBAgQIECAAAECBAgQIECAgOFaBwgQIECAAAECBAgQIECAAAECBAgQIEAgJWC4Tr1DGAIECBAgQIAAAQIECBAgQIAAAQIECBAwXOsAAQIECBAgQIAAAQIECBAgQIAAAQIECKQEDNepdwhDgAABAgQIECBAgAABAgQIECBAgAABAoZrHSBAgAABAgQIECBAgAABAgQIECBAgACBlIDhOvUOYQgQIECAAAECBAgQIECAAAECBAgQIEDAcK0DBAgQIECAAAECBAgQIECAAAECBAgQIJASMFyn3iEMAQIECBAgQIAAAQIECBAgQIAAAQIECBiudYAAAQIECBAgQIAAAQIECBAgQIAAAQIEUgKG69Q7hCFAgAABAgQIECBAgAABAgQIECBAgAABw7UOECBAgAABAgQIECBAgAABAgQIECBAgEBKwHCdeocwBAgQIECAAAECBAgQIECAAAECBAgQIGC41gECBAgQIECAAAECBAgQIECAAAECBAgQSAkYrlPvEIYAAQIECBAgQIAAAQIECBAgQIAAAQIEDNc6QIAAAQIECBAgQIAAAQIECBAgQIAAAQIpAcN16h3CECBAgAABAgQIECBAgAABAgQIECBAgIDhWgcIECBAgAABAgQIECBAgAABAgQIECBAICVguE69QxgCBAgQIECAAAECBAgQIECAAAECBAgQMFzrAAECBAgQIECAAAECBAgQIECAAAECBAikBAzXqXcIQ4AAAQIECBAgQIAAAQIECBAgQIAAAQKGax0gQIAAAQIECBAgQIAAAQIECBAgQIAAgZSA4Tr1DmEIECBAgAABAgQIECBAgAABAgQIECBAwHCtAwQIECBAgAABAgQIECBAgAABAgQIECCQEjBcp94hDAECBAgQIECAAAECBAgQIECAAAECBAgYrnWAAAECBAgQIECAAAECBAgQIECAAAECBFIChuvUO4QhQIAAAQIECBAgQIAAAQIECBAgQIAAAcO1DhAgQIAAAQIECBAgQIAAAQIECBAgQIBASsBwnXqHMAQIECBAgAABAgQIECBAgAABAgQIECBguNYBAgQIECBAgAABAgQIECBAgAABAgQIEEgJGK5T7xCGAAECBAgQIECAAAECBAgQIECAAAECBAzXOkCAAAECBAgQIECAAAECBAgQIECAAAECKQHDdeodwhAgQIAAAQIECBAgQIAAAQIECBAgQICA4VoHCBAgQIAAAQIECBAgQIAAAQIECBAgQCAlYLhOvUMYAgQIECBAgAABAgQIECBAgAABAgQIEDBc6wABAgQIECBAgAABAgQIECBAgAABAgQIpAQM16l3CEOAAAECBAgQIECAAAECBAgQIECAAAEChmsdIECAAAECBAgQIECAAAECBAgQIECAAIGUgOE69Q5hCBAgQIAAAQIECBAgQIAAAQIECBAgQMBwrQMECBAgQIAAAQIECBAgQIAAAQIECBAgkBIwXKfeIQwBAgQIECBAgAABAgQIECBAgAABAgQIGK51gAABAgQIECBAgAABAgQIECBAgAABAgRSAobr1DuEIUCAAAECBAgQIECAAAECBAgQIECAAAHDtQ4QIECAAAECBAgQIECAAAECBAgQIECAQErAcJ16hzAECBAgQIAAAQIECBAgQIAAAQIECBAgYLjWAQIECBAgQIAAAQIECBAgQIAAAQIECBBICRiuU+8QhgABAgQIECBAgAABAgQIECBAgAABAgQM1zpAgAABAgQIECBAgAABAgQIECBAgAABAikBw3XqHcIQIECAAAECBAgQIECAAAECBAgQIECAgOFaBwgQIECAAAECBAgQIECAAAECBAgQIEAgJWC4Tr1DGAIECBAgQIAAAQIECBAgQIAAAQIECBAwXOsAAQIECBAgQIAAAQIECBAgQIAAAQIECKQEDNepdwhDgAABAgQIECBAgAABAgQIECBAgAABAoZrHSBAgAABAgQIECBAgAABAgQIECBAgACBlIDhOvUOYQgQIECAAAECBAgQIECAAAECBAgQIEDAcK0DBAgQIECAAAECBAgQIECAAAECBAgQIJASMFyn3iEMAQIECBAgQIAAAQIECBAgQIAAAQIECBiudYAAAQIECBAgQIAAAQIECBAgQIAAAQIEUgKG69Q7hCFAgAABAgQIECBAgAABAgQIECBAgAABw7UOECBAgAABAgQIECBAgAABAgQIECBAgEBKwHCdeocwBAgQIECAAAECBAgQIECAAAECBAgQIGC41gECBAgQIECAAAECBAgQIECAAAECBAgQSAkYrlPvEIYAAQIECBAgQIAAAQIECBAgQIAAAQIEDNc6QIAAAQIECBAgQIAAAQIECBAgQIAAAQIpAcN16h3CECBAgAABAgQIECBAgAABAgQIECBAgIDhWgcIECBAgAABAgQIECBAgAABAgQIECBAICVguE69QxgCBAgQIECAAAECBAgQIECAAAECBAgQMFzrAAECBAgQIECAAAECBAgQIECAAAECBAikBAzXqXcIQ4AAAQIECBAgQIAAAQIECBAgQIAAAQKGax0gQIAAAQIECBAgQIAAAQIECBAgQIAAgZSA4Tr1DmEIECBAgAABAgQIECBAgAABAgQIECBAwHCtAwQIECBAgAABAgQIECBAgAABAgQIECCQEjBcp94hDAECBAgQIECAAAECBAgQIECAAAECBAgYrnWAAAECBAgQIECAAAECBAgQIECAAAECBFIChuvUO4QhQIAAAQIECBAgQIAAAQIECBAgQIAAAcO1DhAgQIAAAQIECBAgQIAAAQIECBAgQIBASsBwnXqHMAQIECBAgAABAgQIECBAgAABAgQIECBguNYBAgQIECBAgAABAgQIECBAgAABAgQIEEgJGK5T7xCGAAECBAgQIECAAAECBAgQIECAAAECBAzXOkCAAAECBAgQIECAAAECBAgQIECAAAECKQHDdeodwhAgQIAAAQIECBAgQIAAAQIECBAgQICA4VoHCBAgQIAAAQIECBAgQIAAAQIECBAgQCAlYLhOvUMYAgQIECBAgAABAgQIECBAgAABAgQIEDBc6wABAgQIECBAgAABAgQIECBAgAABAgQIpAQM16l3CEOAAAECBAgQIECAAAECBAgQIECAAAEChmsdIECAAAECBAgQIECAAAECBAgQIECAAIGUgOE69Q5hCBAgQIAAAQIECBAgQIAAAQIECBAgQMBwrQMECBAgQIAAAQIECBAgQIAAAQIECBAgkBIwXKfeIQwBAgQIECBAgAABAgQIECBAgAABAgQIGK51gAABAgQIECBAgAABAgQIECBAgAABAgRSAobr1DuEIUCAAAECBAgQIECAAAECBAgQIECAAAHDtQ4QIECAAAECBAgQIECAAAECBAgQIECAQErAcJ16hzAECBAgQIAAAQIECBAgQIAAAQIECBAgYLjWAQIECBAgQIAAAQIECBAgQIAAAQIECBBICRiuU+8QhgABAgQIECBAgAABAgQIECBAgAABAgQM1zpAgAABAgQIECBAgAABAgQIECBAgAABAikBw3XqHcIQIECAAAECBAgQIECAAAECBAgQIECAgOFaBwgQIECAAAECBAgQIECAAAECBAgQIEAgJWC4Tr1DGAIECBAgQIAAAQIECBAgQIAAAQIECBAwXOsAAQIECBAgQIAAAQIECBAgQIAAAQIECKQEDNepdwhDgAABAgQIECBAgAABAgQIECBAgAABAoZrHSBAgAABAgQIECBAgAABAgQIECBAgACBlIDhOvUOYQgQIECAAAECBAgQIECAAAECBAgQIEDAcK0DBAgQIECAAAECBAgQIECAAAECBAgQIJASMFyn3iEMAQIECBAgQIAAAQIECBAgQIAAAQIECBiudYAAAQIECBAgQIAAAQIECBAgQIAAAQIEUgKG69Q7hCFAgAABAgQIECBAgAABAgQIECBAgAABw7UOECBAgAABAgQIECBAgAABAgQIECBAgEBKwHCdeocwBAgQIECAAAECBAgQIECAAAECBAgQIGC41gECBAgQIECAAAECBAgQIECAAAECBAgQSAkYrlPvEIYAAQIECBAgQIAAAQIECBAgQIAAAQIEDNc6QIAAAQIECBAgQIAAAQIECBAgQIAAAQIpAcN16h3CECBAgAABAgQIECBAgAABAgQIECBAgIDhWgcIECBAgAABAgQIECBAgAABAgQIECBAICVguE69QxgCBAgQIECAAAECBAgQIECAAAECBAgQMFzrAAECBAgQIECAAAECBAgQIECAAAECBAikBAzXqXcIQ4AAAQIECBAgQIAAAQIECBAgQIAAAQKGax0gQIAAAQIECBAgQIAAAQIECBAgQIAAgZSA4Tr1DmEIECBAgAABAgQIECBAgAABAgQIECBAwHCtAwQIECBAgAABAgQIECBAgAABAgQIECCQEjBcp94hDAECBAgQIECAAAECBAgQIECAAAECBAgYrnWAAAECBAgQIECAAAECBAgQIECAAAECBFIChuvUO4QhQIAAAQIECBAgQIAAAQIECBAgQIAAAcO1DhAgQIAAAQIECBAgQIAAAQIECBAgQIBASsBwnXqHMAQIECBAgAABAgQIECBAgAABAgQIECBguNYBAgQIECBAgAABAgQIECBAgAABAgQIEEgJGK5T7xCGAAECBAgQIECAAAECBAgQIECAAAECBAzXOkCAAAECBAgQIECAAAECBAgQIECAAAECKQHDdeodwhAgQIAAAQIECBAgQIAAAQIECBAgQICA4VoHCBAgQIAAAQIECBAgQIAAAQIECBAgQCAlYLhOvUMYAgQIECBAgAABAgQIECBAgAABAgQIEDBc6wABAgQIECBAgAABAgQIECBAgAABAgQIpAQM16l3CEOAAAECBAgQIECAAAECBAgQIECAAAEChmsdIECAAAECBAgQIECAAAECBAgQIECAAIGUgOE69Q5hCBAgQIAAAQIECBAgQIAAAQIECBAgQMBwrQMECBAgQIAAAQIECBAgQIAAAQIECBAgkBIwXKfeIQwBAgQIECBAgAABAgQIECBAgAABAgQIGK51gAABAgQIECBAgAABAgQIECBAgAABAgRSAobr1DuEIUCAAAECBAgQIECAAAECBAgQIECAAAHDtQ4QIECAAAECBAgQIECAAAECBAgQIECAQErAcJ16hzAECBAgQIAAAQIECBAgQIAAAQIECBAgYLjWAQIECBAgQIAAAQIECBAgQIAAAQIECBBICRiuU+8QhgABAgQIECBAgAABAgQIECBAgAABAgQM1zpAgAABAgQIECBAgAABAgQIECBAgAABAikBw3XqHcIQIECAAAECBAgQIECAAAECBAgQIECAgOFaBwgQIECAAAECBAgQIECAAAECBAgQIEAgJWC4Tr1DGAIECBAgQIAAAQIECBAgQIAAAQIECBAwXOsAAQIECBAgQIAAAQIECBAgQIAAAQIECKQEDNepdwhDgAABAgQIECBAgAABAgQIECBAgAABAoZrHSBAgAABAgQIECBAgAABAgQIECBAgACBlIDhOvUOYQgQIECAAAECBAgQIECAAAECBAgQIEDAcK0DBAgQIECAAAECBAgQIECAAAECBAgQIJASMFyn3iEMAQIECBAgQIAAAQIECBAgQIAAAQIECBiudYAAAQIECBAgQIAAAQIECBAgQIAAAQIEUgKG69Q7hCFAgAABAgQIECBAgAABAgQIECBAgAABw7UOECBAgAABAgQIECBAgAABAgQIECBAgEBKwHCdeocwBAgQIECAAAECBAgQIECAAAECBAgQIGC41gECBAgQIECAAAECBAgQIECAAAECBAgQSAkYrlPvEIYAAQIECBAgQIAAAQIECBAgQFx+NrMAAAhoSURBVIAAAQIEDNc6QIAAAQIECBAgQIAAAQIECBAgQIAAAQIpAcN16h3CECBAgAABAgQIECBAgAABAgQIECBAgIDhWgcIECBAgAABAgQIECBAgAABAgQIECBAICVguE69QxgCBAgQIECAAAECBAgQIECAAAECBAgQMFzrAAECBAgQIECAAAECBAgQIECAAAECBAikBAzXqXcIQ4AAAQIECBAgQIAAAQIECBAgQIAAAQKGax0gQIAAAQIECBAgQIAAAQIECBAgQIAAgZSA4Tr1DmEIECBAgAABAgQIECBAgAABAgQIECBAwHCtAwQIECBAgAABAgQIECBAgAABAgQIECCQEjBcp94hDAECBAgQIECAAAECBAgQIECAAAECBAgYrnWAAAECBAgQIECAAAECBAgQIECAAAECBFIChuvUO4QhQIAAAQIECBAgQIAAAQIECBAgQIAAAcO1DhAgQIAAAQIECBAgQIAAAQIECBAgQIBASsBwnXqHMAQIECBAgAABAgQIECBAgAABAgQIECBguNYBAgQIECBAgAABAgQIECBAgAABAgQIEEgJGK5T7xCGAAECBAgQIECAAAECBAgQIECAAAECBAzXOkCAAAECBAgQIECAAAECBAgQIECAAAECKQHDdeodwhAgQIAAAQIECBAgQIAAAQIECBAgQICA4VoHCBAgQIAAAQIECBAgQIAAAQIECBAgQCAlYLhOvUMYAgQIECBAgAABAgQIECBAgAABAgQIEDBc6wABAgQIECBAgAABAgQIECBAgAABAgQIpAQM16l3CEOAAAECBAgQIECAAAECBAgQIECAAAEChmsdIECAAAECBAgQIECAAAECBAgQIECAAIGUgOE69Q5hCBAgQIAAAQIECBAgQIAAAQIECBAgQMBwrQMECBAgQIAAAQIECBAgQIAAAQIECBAgkBIwXKfeIQwBAgQIECBAgAABAgQIECBAgAABAgQIGK51gAABAgQIECBAgAABAgQIECBAgAABAgRSAobr1DuEIUCAAAECBAgQIECAAAECBAgQIECAAAHDtQ4QIECAAAECBAgQIECAAAECBAgQIECAQErAcJ16hzAECBAgQIAAAQIECBAgQIAAAQIECBAgYLjWAQIECBAgQIAAAQIECBAgQIAAAQIECBBICRiuU+8QhgABAgQIECBAgAABAgQIECBAgAABAgQM1zpAgAABAgQIECBAgAABAgQIECBAgAABAikBw3XqHcIQIECAAAECBAgQIECAAAECBAgQIECAgOFaBwgQIECAAAECBAgQIECAAAECBAgQIEAgJWC4Tr1DGAIECBAgQIAAAQIECBAgQIAAAQIECBAwXOsAAQIECBAgQIAAAQIECBAgQIAAAQIECKQEDNepdwhDgAABAgQIECBAgAABAgQIECBAgAABAoZrHSBAgAABAgQIECBAgAABAgQIECBAgACBlIDhOvUOYQgQIECAAAECBAgQIECAAAECBAgQIEDAcK0DBAgQIECAAAECBAgQIECAAAECBAgQIJASMFyn3iEMAQIECBAgQIAAAQIECBAgQIAAAQIECBiudYAAAQIECBAgQIAAAQIECBAgQIAAAQIEUgKG69Q7hCFAgAABAgQIECBAgAABAgQIECBAgAABw7UOECBAgAABAgQIECBAgAABAgQIECBAgEBKwHCdeocwBAgQIECAAAECBAgQIECAAAECBAgQIGC41gECBAgQIECAAAECBAgQIECAAAECBAgQSAkYrlPvEIYAAQIECBAgQIAAAQIECBAgQIAAAQIEDNc6QIAAAQIECBAgQIAAAQIECBAgQIAAAQIpAcN16h3CECBAgAABAgQIECBAgAABAgQIECBAgIDhWgcIECBAgAABAgQIECBAgAABAgQIECBAICVguE69QxgCBAgQIECAAAECBAgQIECAAAECBAgQMFzrAAECBAgQIECAAAECBAgQIECAAAECBAikBAzXqXcIQ4AAAQIECBAgQIAAAQIECBAgQIAAAQKGax0gQIAAAQIECBAgQIAAAQIECBAgQIAAgZSA4Tr1DmEIECBAgAABAgQIECBAgAABAgQIECBAwHCtAwQIECBAgAABAgQIECBAgAABAgQIECCQEjBcp94hDAECBAgQIECAAAECBAgQIECAAAECBAgYrnWAAAECBAgQIECAAAECBAgQIECAAAECBFIChuvUO4QhQIAAAQIECBAgQIAAAQIECBAgQIAAAcO1DhAgQIAAAQIECBAgQIAAAQIECBAgQIBASsBwnXqHMAQIECBAgAABAgQIECBAgAABAgQIECBguNYBAgQIECBAgAABAgQIECBAgAABAgQIEEgJGK5T7xCGAAECBAgQIECAAAECBAgQIECAAAECBAzXOkCAAAECBAgQIECAAAECBAgQIECAAAECKQHDdeodwhAgQIAAAQIECBAgQIAAAQIECBAgQICA4VoHCBAgQIAAAQIECBAgQIAAAQIECBAgQCAlYLhOvUMYAgQIECBAgAABAgQIECBAgAABAgQIEDBc6wABAgQIECBAgAABAgQIECBAgAABAgQIpAQM16l3CEOAAAECBAgQIECAAAECBAgQIECAAAEChmsdIECAAAECBAgQIECAAAECBAgQIECAAIGUgOE69Q5hCBAgQIAAAQIECBAgQIAAAQIECBAgQMBwrQMECBAgQIAAAQIECBAgQIAAAQIECBAgkBIwXKfeIQwBAgQIECBAgAABAgQIECBAgAABAgQIGK51gAABAgQIECBAgAABAgQIECBAgAABAgRSAobr1DuEIUCAAAECBAgQIECAAAECBAgQIECAAAHDtQ4QIECAAAECBAgQIECAAAECBAgQIECAQErgAVaaAXRKZQxmAAAAAElFTkSuQmCC";
let texture = new THREE.Texture();
texture.image = image;
image.onload = function () {
  texture.needsUpdate = true;
};

texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
let material = new THREE.MeshLambertMaterial({ map: texture });
let cubeSize = 150;
let cubeMesh = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
var cube = new THREE.Mesh(cubeMesh, material);
scene.add(cube);

var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
camera.position.y = 160;
camera.position.z = 400;
camera.lookAt(cube.position);

scene.add(camera);

//Add ambient light to make the scene more light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

var clock = new THREE.Clock();

function render() {
  requestAnimationFrame(render);
  cube.rotation.y -= 0.005;
  cube.rotation.z += 0.005;
  renderer.render(scene, camera);
}

render();