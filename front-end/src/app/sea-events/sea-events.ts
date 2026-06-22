import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface SeaEvent {
  name: string;
  image: string;
  type: string;
  location_seas: string[];
  danger_level: string;
  description: string;
  rewards: {
    fragments: string;
    belly: string;
    items: string[];
  };
  how_to_defeat?: string;
  how_to_escape?: string;
  how_to_get?: string;
  how_to_access?: string;
}

@Component({
  selector: 'app-sea-events',
  imports: [FormsModule, CommonModule],
  templateUrl: './sea-events.html',
  styleUrl: './sea-events.css',
})
export class SeaEvents implements OnInit {

  seaEventArray: SeaEvent[] = [];
  searchText = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {



    this.http
      .get<{ allSeaEvents: SeaEvent[] }>(
        'assets/data/JSON/sea-events.json'
      )
      .subscribe({
        next: (data) => {

          this.seaEventArray = data.allSeaEvents;

          localStorage.setItem(
            'allSeaEvents',
            JSON.stringify(this.seaEventArray) 
          );

          console.log('Loaded from JSON!');
        },
        error: (err) => {
          console.error('Failed to load sea events:', err);
        }
      });
  }

  filteredSeaEvents(): SeaEvent[] {

    if (!this.searchText.trim()) {
      return this.seaEventArray;
    }

    return this.seaEventArray.filter(event =>
      event.name
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }

  dangerClass(level: string): string {

    switch (level.toLowerCase()) {

      case 'low':
        return 'bg-green-500';

      case 'low to medium':
        return 'bg-lime-500';

      case 'medium':
        return 'bg-yellow-500';

      case 'medium to high':
        return 'bg-orange-500';

      case 'high':
        return 'bg-red-500';

      default:
        return 'bg-purple-600';
    }
  }

  openDetails(event: SeaEvent) {
    this.router.navigate(['/sea-events',event.name]);
  }
}
