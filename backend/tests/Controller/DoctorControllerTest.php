<?php

namespace App\Tests\Controller;

use App\Repository\DoctorRepository;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DoctorControllerTest extends WebTestCase
{
    public function testSearchDoctors(): void
    {
        $client = static::createClient();
        
        // Mock-Repository für die Suche
        $doctorRepository = $this->createMock(DoctorRepository::class);
        $doctorRepository->expects($this->once())
            ->method('searchByNameOrSpecialization')
            ->willReturn([]);
        
        // Test ohne Suchbegriff
        $client->request('GET', '/api/doctors/search');
        $this->assertResponseStatusCodeSame(400);
        
        // Test mit Suchbegriff
        $client->request('GET', '/api/doctors/search?term=test');
        $this->assertResponseIsSuccessful();
    }
} 