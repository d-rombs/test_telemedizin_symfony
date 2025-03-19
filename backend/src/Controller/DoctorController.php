<?php

namespace App\Controller;

use App\Repository\DoctorRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
class DoctorController extends AbstractController
{
    #[Route('/doctors/search', name: 'app_doctors_search', methods: ['GET'])]
    public function search(Request $request, DoctorRepository $doctorRepository, SerializerInterface $serializer): JsonResponse
    {
        $searchTerm = $request->query->get('term');
        
        if (!$searchTerm) {
            return $this->json(['message' => 'Suchbegriff erforderlich'], 400);
        }
        
        $doctors = $doctorRepository->searchByNameOrSpecialization($searchTerm);
        
        $data = $serializer->serialize($doctors, 'json', [
            'groups' => ['doctor:read']
        ]);
        
        return new JsonResponse($data, 200, [], true);
    }
} 