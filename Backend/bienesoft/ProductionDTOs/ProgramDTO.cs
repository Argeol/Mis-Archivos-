﻿using bienesoft.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Bienesoft.Models;

namespace bienesoft.ProductionDTOs
{
    public class ProgramDTO
    {
        public int Program_Id { get; set; }
        public string Program_Name { get; set; }

        public string Area_Name { get; set; }
        public string State { get; set; } = ProgramState.Activo.ToString();

    }
}
