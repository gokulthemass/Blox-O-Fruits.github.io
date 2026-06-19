import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { CommonModule } from '@angular/common'; 

interface fruits {
  name: string;
  value: string
  image: string;
  rarity: string;
  fruit_type: string;
  trend: string;
  demand: number;
  price_beli: number;
  price_robux: number;
  best_for: string;
  moves: Array<{
    name: string;
    key: string;
    mastery: number;
    description: string;
  }>;
}

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body implements OnInit{
  FruitArray: fruits[] = [];

  constructor(private router: Router, private http: HttpClient){}

  ngOnInit(): void {
      
    const savedData = localStorage.getItem('allFeaturedFruit')

    if(savedData){
      try{
        this.FruitArray = JSON.parse(savedData);
        console.log('data updated as per the localstorage');
      }catch{

      }
    }

    this.http
    .get<{ allFeaturedFruit: fruits[]}>(
      'assets/data/JSON/featuredFruits.json'
    ).subscribe({
      next: (data) => {
        this.FruitArray = data.allFeaturedFruit

        localStorage.setItem(
          'allFeaturedFruit',
          JSON.stringify(this.FruitArray)
        )
      }
    })
  }

    rarityClass(rarity: string): string {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'bg-gray-500';

      case 'uncommon':
        return 'bg-green-500';

      case 'rare':
        return 'bg-blue-500';

      case 'epic':
        return 'bg-purple-500';

      case 'legendary':
        return 'bg-orange-500';

      case 'mythical':
        return 'bg-red-500';

      default:
        return 'bg-gray-700';
    }
  }

  openDetail(fruit: fruits){
    this.router.navigate(['/fruits', fruit.name]);
  }
}
