import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Hero } from '../model/hero';
import { HeroService } from '../services/hero.service';

@Component({
  selector: 'my-hero-detail',
  templateUrl: 'hero-detail.component.html',
  styleUrls: ['hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  constructor(
    private heroService: HeroService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {

      if (params['id'] === undefined){
        this.navigated = false;
        this.hero = new Hero();
      } else if (params['id'] === 'new') {
        this.navigated = true;
        this.hero = new Hero();
      } else {
        let id = +params['id'];
        this.navigated = true;
        this.heroService.getHero(id)
            .then(hero => this.hero = hero);
      }
    });
  }

  deleteHero(event: any): void {
    event.stopPropagation();
    if (!confirm(`Are you sure you want to delete ${this.hero.name}?`)) return
    this.heroService
      .delete(this.hero)
      .then(res => {
        this.goBack()
      })
      .catch(error => this.error = error);
  }

  save(): void {
    this.heroService
        .save(this.hero)
        .then(hero => {
          this.hero = hero; // saved hero, w/ id if new
          this.goBack(hero);
        })
        .catch(error => this.error = error); // TODO: Display error message
  }

  goBack(savedHero: Hero = null): void {
    this.close.emit(savedHero);
    if (this.navigated) { window.history.back(); }
  }
}
